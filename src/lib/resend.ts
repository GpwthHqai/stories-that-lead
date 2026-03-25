import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("[Resend] RESEND_API_KEY not set — emails will not be sent");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Sender address — uses verified domain when available, falls back to Resend default
export const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "Vernon Ross <onboarding@resend.dev>";

// Once storiesthatlead.co is verified in Resend, update RESEND_FROM_ADDRESS to:
// "Vernon Ross <hello@storiesthatlead.co>"
