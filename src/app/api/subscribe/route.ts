import { NextRequest, NextResponse } from "next/server";

// Profile key → GHL tag name mapping
const PROFILE_TAG_MAP: Record<string, string> = {
    narrator: "profile: strategic narrator",
    pioneer: "profile: ai pioneer",
    builder: "profile: framework builder",
    movement: "profile: movement maker",
    architect: "profile: transformation architect",
    voice: "profile: voice of authority",
};

export async function POST(request: NextRequest) {
    try {
          const { email, first_name, source, profile } = await request.json();

      if (!email || !email.includes("@")) {
              return NextResponse.json(
                { error: "Valid email is required" },
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

      // Upsert contact in GHL
      const ghlResponse = await fetch(
              "https://rest.gohighlevel.com/v1/contacts/",
        {
                  method: "POST",
                  headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${ghlApiKey}`,
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
