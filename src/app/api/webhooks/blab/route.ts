import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import { bookingConfirmationEmail } from "@/lib/emails";

/**
 * Book Like a Boss Webhook Handler
 *
 * Configure in BLAB:
 *   Name: "STL Guest Booking"
 *   Callback URL: https://www.storiesthatlead.co/api/webhooks/blab
 *   Trigger On: Created, Cancelled, Rescheduled
 *
 * Environment variables:
 *   BLAB_WEBHOOK_SECRET — optional shared secret for verifying requests
 *   RESEND_API_KEY — Resend API key for sending emails
 *   RESEND_FROM_ADDRESS — sender address (e.g., "Vernon Ross <hello@storiesthatlead.co>")
 */

const PREP_FORM_URL = "https://www.storiesthatlead.co/guest";
const VERNON_EMAIL = process.env.VERNON_EMAIL || "vernon@vernonross.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Optional: verify webhook secret if configured
    const secret = process.env.BLAB_WEBHOOK_SECRET;
    if (secret) {
      const headerSecret =
        request.headers.get("x-webhook-secret") ||
        request.headers.get("authorization");
      if (headerSecret !== secret && headerSecret !== `Bearer ${secret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const eventType = body.event || body.type || "unknown";

    console.log(`[BLAB Webhook] Event: ${eventType}`, {
      name: body.name || body.customer?.name,
      email: body.email || body.customer?.email,
      date: body.date || body.appointment?.date,
      timestamp: new Date().toISOString(),
    });

    switch (eventType) {
      case "created":
      case "booking.created": {
        const guestEmail = body.email || body.customer?.email;
        const guestName = body.name || body.customer?.name || "there";
        const bookingDate = body.date || body.appointment?.date;

        if (guestEmail) {
          // Send booking confirmation to guest
          const { subject, html } = bookingConfirmationEmail({
            guestName,
            bookingDate,
            prepFormUrl: PREP_FORM_URL,
          });

          const { error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to: guestEmail,
            replyTo: VERNON_EMAIL,
            subject,
            html,
          });

          if (error) {
            console.error("[BLAB Webhook] Failed to send confirmation email:", error);
          } else {
            console.log(
              `[BLAB Webhook] Confirmation sent to ${guestName} (${guestEmail})`
            );
          }

          // Notify Vernon
          await resend.emails.send({
            from: FROM_ADDRESS,
            to: VERNON_EMAIL,
            subject: `New STL booking: ${guestName}`,
            html: `<p><strong>${guestName}</strong> (${guestEmail}) just booked a recording session${bookingDate ? ` for ${bookingDate}` : ""}.</p><p>Confirmation email with the prep form link has been sent.</p>`,
          });
        }
        break;
      }

      case "cancelled":
      case "booking.cancelled": {
        const guestEmail = body.email || body.customer?.email;
        const guestName = body.name || body.customer?.name || "A guest";
        console.log(`[BLAB Webhook] Booking cancelled: ${guestEmail}`);

        // Notify Vernon of cancellation
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: VERNON_EMAIL,
          subject: `STL booking cancelled: ${guestName}`,
          html: `<p><strong>${guestName}</strong> (${guestEmail}) cancelled their recording session.</p>`,
        });
        break;
      }

      case "rescheduled":
      case "booking.rescheduled": {
        const guestEmail = body.email || body.customer?.email;
        const guestName = body.name || body.customer?.name || "A guest";
        const newDate = body.new_date || body.appointment?.date;
        console.log(
          `[BLAB Webhook] Booking rescheduled: ${guestEmail} → ${newDate}`
        );

        // Notify Vernon of reschedule
        await resend.emails.send({
          from: FROM_ADDRESS,
          to: VERNON_EMAIL,
          subject: `STL booking rescheduled: ${guestName}`,
          html: `<p><strong>${guestName}</strong> (${guestEmail}) rescheduled their recording session${newDate ? ` to ${newDate}` : ""}.</p>`,
        });
        break;
      }

      default:
        console.log(`[BLAB Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true, event: eventType });
  } catch (error) {
    console.error("[BLAB Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// BLAB may send a GET to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", service: "stories-that-lead-blab-webhook" });
}
