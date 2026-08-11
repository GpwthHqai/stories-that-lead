import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import path from "path";
import crypto from "crypto";
import { getResend, FROM_ADDRESS } from "@/lib/resend";
import { isValidEmail } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import {
  guestPrepConfirmationEmail,
  guestNotificationEmail,
} from "@/lib/emails";

/**
 * Guest Prep Form Submission Handler
 *
 * Receives the multipart form data from the guest booking page,
 * saves file uploads, sends confirmation emails, and notifies Vernon.
 */

const VERNON_EMAIL = process.env.VERNON_EMAIL || "vernon@vernonross.com";

const FILE_LABELS: Record<string, string> = {
  headshot: "Headshot",
  logo: "Logo",
  promoImage: "Promo Image",
  mediaKit: "Media Kit",
};

// ── File Upload Security ─────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/zip",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
  "application/zip": ".zip",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_TOTAL_SIZE = 40 * 1024 * 1024; // 40MB total across all files

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 requests per minute per IP
    const ip = getClientIP(request);
    const { allowed, resetAt } = checkRateLimit(`guest-submit:${ip}`, {
      limit: 3,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) },
        }
      );
    }

    const formData = await request.formData();

    // Extract text fields
    const textFields: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        textFields[key] = value;
      }
    }

    // Validate required fields
    const required = [
      "fullName",
      "email",
      "title",
      "company",
      "bio",
      "topicPitch",
      "revelationMoment",
    ];
    const missing = required.filter((f) => !textFields[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format before sending any emails
    if (!isValidEmail(textFields.email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Stable path prefix per guest, used for durable object storage.
    const sanitizedName = textFields.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    const timestamp = new Date().toISOString().split("T")[0];
    const folder = `guest-uploads/${timestamp}-${sanitizedName}`;

    // Validate + persist uploaded files. Primary: durable Vercel Blob storage
    // (returns a link). Fallback if Blob is not configured: attach to the
    // notification email so the file is never silently lost.
    const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
    const emailFiles: { label: string; filename: string; url?: string }[] = [];
    const attachments: { filename: string; content: string }[] = [];
    let totalFileSize = 0;

    for (const key of Object.keys(FILE_LABELS)) {
      for (const file of formData.getAll(key)) {
        if (!(file instanceof File) || file.size === 0) continue;

        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `File "${file.name}" exceeds 10MB limit` },
            { status: 400 }
          );
        }
        totalFileSize += file.size;
        if (totalFileSize > MAX_TOTAL_SIZE) {
          return NextResponse.json(
            { error: "Total upload size exceeds 40MB limit" },
            { status: 400 }
          );
        }
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          return NextResponse.json(
            {
              error: `File type "${file.type}" not allowed. Accepted: images (JPEG, PNG, WebP, GIF, SVG), PDF, ZIP`,
            },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = MIME_TO_EXT[file.type] || path.extname(file.name).toLowerCase();
        const objectName = `${folder}/${key}-${crypto.randomBytes(8).toString("hex")}${ext}`;

        let stored = false;
        if (hasBlob) {
          try {
            const blob = await put(objectName, buffer, {
              access: "public",
              contentType: file.type,
              addRandomSuffix: false,
            });
            emailFiles.push({ label: FILE_LABELS[key], filename: file.name, url: blob.url });
            stored = true;
          } catch (err) {
            console.error("[Guest Submit] Blob upload failed, attaching to email instead:", err);
          }
        }
        if (!stored) {
          attachments.push({ filename: `${key}-${file.name}`, content: buffer.toString("base64") });
          emailFiles.push({ label: FILE_LABELS[key], filename: file.name });
        }
      }
    }

    console.log(
      "[Guest Submit] New guest application:",
      textFields.fullName,
      textFields.email,
      `(${emailFiles.length} file(s) via ${hasBlob ? "blob" : "email attachment"})`
    );

    // ── Send Emails ──────────────────────────────────────────────────────

    // 1. Confirmation to guest
    const { subject: guestSubject, html: guestHtml } =
      guestPrepConfirmationEmail({
        guestName: textFields.fullName,
        topicPitch: textFields.topicPitch,
      });

    const { error: guestEmailError } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: textFields.email,
      replyTo: VERNON_EMAIL,
      subject: guestSubject,
      html: guestHtml,
    });

    if (guestEmailError) {
      console.error("[Guest Submit] Failed to send guest confirmation:", guestEmailError);
    }

    // 2. Notification to Vernon
    const { subject: notifySubject, html: notifyHtml } =
      guestNotificationEmail({
        guestName: textFields.fullName,
        guestEmail: textFields.email,
        company: textFields.company,
        title: textFields.title,
        topicPitch: textFields.topicPitch,
        revelationMoment: textFields.revelationMoment,
        files: emailFiles,
      });

    const { error: notifyError } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: VERNON_EMAIL,
      subject: notifySubject,
      html: notifyHtml,
      ...(attachments.length ? { attachments } : {}),
    });

    if (notifyError) {
      console.error("[Guest Submit] Failed to send Vernon notification:", notifyError);
    }

    return NextResponse.json({
      success: true,
      message: "Guest application received",
      guest: textFields.fullName,
    });
  } catch (error) {
    console.error("[Guest Submit] Error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
