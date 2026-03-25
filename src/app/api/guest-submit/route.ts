import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { resend, FROM_ADDRESS } from "@/lib/resend";
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

const UPLOAD_DIR = process.env.GUEST_UPLOAD_DIR || "/tmp/stl-guest-uploads";
const VERNON_EMAIL = process.env.VERNON_EMAIL || "vernon@vernonross.com";

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

    // Create upload directory for this guest
    const sanitizedName = textFields.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    const timestamp = new Date().toISOString().split("T")[0];
    const guestDir = path.join(UPLOAD_DIR, `${timestamp}-${sanitizedName}`);
    await mkdir(guestDir, { recursive: true });

    // Save uploaded files with security validation
    const fileKeys = ["headshot", "logo", "promoImage", "mediaKit"];
    const fileFields: Record<string, string[]> = {};
    let totalFileSize = 0;

    for (const key of fileKeys) {
      const files = formData.getAll(key);
      fileFields[key] = [];

      for (const file of files) {
        if (file instanceof File && file.size > 0) {
          // Validate file size
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

          // Validate MIME type
          if (!ALLOWED_MIME_TYPES.has(file.type)) {
            return NextResponse.json(
              {
                error: `File type "${file.type}" not allowed. Accepted: images (JPEG, PNG, WebP, GIF, SVG), PDF, ZIP`,
              },
              { status: 400 }
            );
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Use crypto-random filename with correct extension from MIME type
          const ext = MIME_TO_EXT[file.type] || path.extname(file.name).toLowerCase();
          const randomName = crypto.randomBytes(16).toString("hex");
          const filePath = path.join(guestDir, `${key}-${randomName}${ext}`);
          await writeFile(filePath, buffer);
          fileFields[key].push(filePath);
        }
      }
    }

    // Save submission metadata as JSON
    const submission = {
      ...textFields,
      files: fileFields,
      submittedAt: new Date().toISOString(),
      uploadDir: guestDir,
    };

    const metaPath = path.join(guestDir, "submission.json");
    await writeFile(metaPath, JSON.stringify(submission, null, 2));

    console.log(
      "[Guest Submit] New guest application:",
      textFields.fullName,
      textFields.email
    );

    // ── Send Emails ──────────────────────────────────────────────────────

    // 1. Confirmation to guest
    const { subject: guestSubject, html: guestHtml } =
      guestPrepConfirmationEmail({
        guestName: textFields.fullName,
        topicPitch: textFields.topicPitch,
      });

    const { error: guestEmailError } = await resend.emails.send({
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
      });

    const { error: notifyError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: VERNON_EMAIL,
      subject: notifySubject,
      html: notifyHtml,
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
