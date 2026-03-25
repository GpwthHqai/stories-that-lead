import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "[Resend] RESEND_API_KEY is not set. Email functionality requires this environment variable. " +
      "Set it in your .env.local file or Vercel dashboard."
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Sender address — uses verified domain when available, falls back to Resend default
export const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "Vernon Ross <onboarding@resend.dev>";

// Once storiesthatlead.co is verified in Resend, update RESEND_FROM_ADDRESS to:
// "Vernon Ross <hello@storiesthatlead.co>"
