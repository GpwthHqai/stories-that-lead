import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, sanitizeString } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// Profile key → GHL tag name mapping
const PROFILE_TAG_MAP: Record<string, string> = {
  narrator: "profile: strategic narrator",
  pioneer: "profile: ai pioneer",
  builder: "profile: framework builder",
  movement: "profile: movement maker",
  architect: "profile: transformation architect",
  voice: "profile: voice of authority",
};

const VALID_SOURCES = new Set(["hero", "lead-magnet", "bottom", "assessment"]);

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per minute per IP
    const ip = getClientIP(request);
    const { allowed, resetAt } = checkRateLimit(`subscribe:${ip}`, {
      limit: 5,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)) },
        }
      );
    }

    const body = await request.json();

    const email = sanitizeString(body.email, 254);
    const first_name = sanitizeString(body.first_name, 100);
    const source = sanitizeString(body.source, 50);
    const profile = sanitizeString(body.profile, 50);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Validate source and profile against known values
    if (source && !VALID_SOURCES.has(source)) {
      return NextResponse.json(
        { error: "Invalid source" },
        { status: 400 }
      );
    }

    if (profile && !PROFILE_TAG_MAP[profile]) {
      return NextResponse.json(
        { error: "Invalid profile" },
        { status: 400 }
      );
    }

    const ghlApiKey = process.env.GHL_API_KEY;
    const ghlLocationId = process.env.GHL_LOCATION_ID;

    if (!ghlApiKey || !ghlLocationId) {
      console.error("GHL credentials not configured");
      return NextResponse.json(
        { error: "Service not configured" },
        { status: 500 }
      );
    }

    // Determine which tags to apply based on source
    const isAssessment = source === "assessment" && profile && PROFILE_TAG_MAP[profile];
    const tags: string[] = isAssessment
      ? ["AI Assessment Seq", PROFILE_TAG_MAP[profile]]
      : ["stl-signup"];

    // Build contact payload for GHL
    const contactPayload: Record<string, unknown> = {
      email,
      firstName: first_name || "",
      locationId: ghlLocationId,
      tags,
    };

    // Upsert contact in GHL (v2 API — required for Private Integration Tokens)
    const ghlResponse = await fetch(
      "https://services.leadconnectorhq.com/contacts/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ghlApiKey}`,
          Version: "2021-07-28",
        },
        body: JSON.stringify(contactPayload),
      }
    );

    if (!ghlResponse.ok) {
      const errorData = await ghlResponse.text();
      console.error("GHL error:", errorData);
      return NextResponse.json(
        { error: "Failed to subscribe" },
        { status: 500 }
      );
    }

    console.log(
      `New subscriber: ${email} | source: ${source} | tags: ${tags.join(", ")} | GHL: success`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
