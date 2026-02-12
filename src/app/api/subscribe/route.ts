import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, first_name, source } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // ─── SendFox Integration ───────────────────────────────────
    // To connect SendFox:
    // 1. Get your API token from https://sendfox.com/account/api
    // 2. Get your list ID from SendFox dashboard
    // 3. Set these environment variables in Vercel:
    //    - SENDFOX_API_TOKEN
    //    - SENDFOX_LIST_ID
    //
    // The code below will automatically use them when set.
    // ───────────────────────────────────────────────────────────

    const sendfoxToken = process.env.SENDFOX_API_TOKEN;
    const sendfoxListId = process.env.SENDFOX_LIST_ID;

    if (sendfoxToken && sendfoxListId) {
      // SendFox API call
      const sendfoxResponse = await fetch(
        "https://api.sendfox.com/contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sendfoxToken}`,
          },
          body: JSON.stringify({
            email,
            first_name: first_name || "",
            lists: [parseInt(sendfoxListId)],
          }),
        }
      );

      if (!sendfoxResponse.ok) {
        const errorData = await sendfoxResponse.text();
        console.error("SendFox error:", errorData);
        return NextResponse.json(
          { error: "Failed to subscribe" },
          { status: 500 }
        );
      }

      console.log(
        `New subscriber: ${email} (source: ${source}, SendFox: success)`
      );
    } else {
      // No SendFox credentials — log the subscription for now
      console.log(
        `New subscriber: ${email} (name: ${first_name || "N/A"}, source: ${source})`
      );
      console.log(
        "⚠️  SendFox not configured. Set SENDFOX_API_TOKEN and SENDFOX_LIST_ID env vars."
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
