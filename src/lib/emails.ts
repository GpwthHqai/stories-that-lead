/**
 * Stories That Lead — Email Templates
 *
 * Brand-consistent HTML email templates for guest communications.
 * Colors: Navy #0e182f, Gold #cba34c, Cream #f5f0e8, Orange CTA #ce3c06
 * Voice: Direct, first-person, peer-to-peer. Signs off as "— Vernon"
 */

const STYLES = {
  wrapper: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
    background-color: #0e182f;
    color: #f5f0e8;
    padding: 40px 20px;
  `,
  container: `
    max-width: 560px;
    margin: 0 auto;
    background-color: #1e2b46;
    border-radius: 12px;
    border: 1px solid rgba(42, 61, 98, 0.5);
    padding: 40px 32px;
  `,
  logo: `
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
    text-align: center;
  `,
  h1: `
    font-size: 24px;
    font-weight: 700;
    color: #f5f0e8;
    margin: 0 0 8px 0;
    line-height: 1.3;
  `,
  gold: `color: #cba34c;`,
  body: `
    font-size: 15px;
    line-height: 1.7;
    color: #9ca3af;
    margin: 16px 0;
  `,
  cta: `
    display: inline-block;
    background-color: #ce3c06;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    padding: 12px 28px;
    border-radius: 8px;
    text-decoration: none;
    margin: 24px 0;
  `,
  divider: `
    width: 48px;
    height: 2px;
    background: linear-gradient(90deg, #cba34c, #e0be6a);
    border: none;
    margin: 24px 0;
  `,
  signoff: `
    color: #cba34c;
    font-weight: 700;
    font-size: 15px;
    margin-top: 24px;
  `,
  footer: `
    text-align: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(42, 61, 98, 0.3);
    font-size: 12px;
    color: #6b7280;
  `,
};

// ─── Booking Confirmation Email ──────────────────────────────────────────────
export function bookingConfirmationEmail({
  guestName,
  bookingDate,
  prepFormUrl,
}: {
  guestName: string;
  bookingDate?: string;
  prepFormUrl: string;
}): { subject: string; html: string } {
  const firstName = guestName.split(" ")[0];
  const dateDisplay = bookingDate
    ? `<p style="${STYLES.body}">Your recording date: <strong style="color: #f5f0e8;">${bookingDate}</strong></p>`
    : "";

  return {
    subject: "You're booked — here's what's next",
    html: `
      <div style="${STYLES.wrapper}">
        <div style="${STYLES.container}">
          <div style="${STYLES.logo}">
            <span style="color: #f5f0e8;">STORIES THAT </span><span style="${STYLES.gold}">LEAD</span>
          </div>

          <hr style="${STYLES.divider}" />

          <h1 style="${STYLES.h1}">You're <span style="${STYLES.gold}">Booked</span></h1>

          <p style="${STYLES.body}">
            ${firstName}, thanks for scheduling a recording session for Stories That Lead.
            I'm looking forward to the conversation.
          </p>

          ${dateDisplay}

          <p style="${STYLES.body}">
            <strong style="color: #f5f0e8;">Next step:</strong> Fill out a short guest prep form.
            It helps me understand your story so I can prepare the right questions and structure
            a conversation that makes you look great.
          </p>

          <p style="${STYLES.body}">
            You'll share some basics about yourself, the topic you want to cover, your "moment
            of revelation," and upload a headshot and logo for episode artwork.
          </p>

          <div style="text-align: center;">
            <a href="${prepFormUrl}" style="${STYLES.cta}">Complete Guest Prep Form</a>
          </div>

          <p style="${STYLES.body}">
            The form takes about 10 minutes. The more specific your answers, the better the
            episode turns out.
          </p>

          <p style="${STYLES.body}">
            Questions before then? Just reply to this email.
          </p>

          <p style="${STYLES.signoff}">— Vernon</p>

          <div style="${STYLES.footer}">
            <p>Stories That Lead — Not Conflict. Revelation.</p>
            <p><a href="https://www.storiesthatlead.co" style="color: #cba34c; text-decoration: none;">storiesthatlead.co</a></p>
          </div>
        </div>
      </div>
    `,
  };
}

// ─── Guest Prep Form Confirmation Email ──────────────────────────────────────
export function guestPrepConfirmationEmail({
  guestName,
  topicPitch,
}: {
  guestName: string;
  topicPitch: string;
}): { subject: string; html: string } {
  const firstName = guestName.split(" ")[0];
  const topicPreview =
    topicPitch.length > 120
      ? topicPitch.substring(0, 120) + "..."
      : topicPitch;

  return {
    subject: "Got everything — you're all set",
    html: `
      <div style="${STYLES.wrapper}">
        <div style="${STYLES.container}">
          <div style="${STYLES.logo}">
            <span style="color: #f5f0e8;">STORIES THAT </span><span style="${STYLES.gold}">LEAD</span>
          </div>

          <hr style="${STYLES.divider}" />

          <h1 style="${STYLES.h1}">You're All <span style="${STYLES.gold}">Set</span></h1>

          <p style="${STYLES.body}">
            ${firstName}, I've received your guest prep form and all your assets.
            I have everything I need to start building your episode.
          </p>

          <p style="${STYLES.body}">
            <strong style="color: #f5f0e8;">Your topic:</strong> ${topicPreview}
          </p>

          <p style="${STYLES.body}">
            <strong style="color: #f5f0e8;">Here's what happens next:</strong>
          </p>

          <p style="${STYLES.body}">
            1. I'll build a Micro-Arc conversation framework based on your answers.
            You'll receive a one-page outline before recording day — no surprises.<br/><br/>
            2. We record for 45-60 minutes via Riverside.fm. Conversational, not scripted.
            I guide the structure so you can focus on sharing your insight.<br/><br/>
            3. I handle editing, artwork, show notes, social clips, and distribution.
            You'll review the final cut before it goes live.
          </p>

          <p style="${STYLES.body}">
            <strong style="color: #f5f0e8;">Technical requirements for recording day:</strong>
            A quiet room, a decent microphone (even AirPods Pro work), and a stable
            internet connection. I'll send you a Riverside.fm link before the session.
          </p>

          <p style="${STYLES.body}">
            Questions? Just reply to this email.
          </p>

          <p style="${STYLES.signoff}">— Vernon</p>

          <div style="${STYLES.footer}">
            <p>Stories That Lead — Not Conflict. Revelation.</p>
            <p><a href="https://www.storiesthatlead.co" style="color: #cba34c; text-decoration: none;">storiesthatlead.co</a></p>
          </div>
        </div>
      </div>
    `,
  };
}

// ─── Internal Notification Email (to Vernon) ─────────────────────────────────
export function guestNotificationEmail({
  guestName,
  guestEmail,
  company,
  title,
  topicPitch,
  revelationMoment,
}: {
  guestName: string;
  guestEmail: string;
  company: string;
  title: string;
  topicPitch: string;
  revelationMoment: string;
}): { subject: string; html: string } {
  return {
    subject: `New STL Guest: ${guestName} (${company})`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a2e;">
        <h2 style="margin: 0 0 16px;">New Guest Application — Stories That Lead</h2>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #6b7280; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${guestName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Title</td><td style="padding: 8px 0;">${title}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Company</td><td style="padding: 8px 0;">${company}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0;"><a href="mailto:${guestEmail}">${guestEmail}</a></td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

        <h3 style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">Topic Pitch</h3>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6;">${topicPitch}</p>

        <h3 style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">Revelation Moment</h3>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6;">${revelationMoment}</p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af;">Submitted via storiesthatlead.co/guest</p>
      </div>
    `,
  };
}
