import { Resend } from "resend";

let client: Resend | null = null;

export function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error(
      "[Resend] RESEND_API_KEY is not set. Email functionality requires this environment variable. " +
        "Set it in your .env.local file or Vercel dashboard."
    );
  }
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS || "Vernon Ross <onboarding@resend.dev>";
