import type { Metadata } from "next";
import GuestBookingClient from "./GuestBookingClient";

export const metadata: Metadata = {
  title: "Be a Guest — Stories That Lead | Vernon Ross",
  description:
    "Book your guest spot on Stories That Lead. Pick a recording date, share your story, and upload your media kit — all in one place. A leadership communication podcast hosted by Vernon Ross.",
  openGraph: {
    title: "Be a Guest — Stories That Lead",
    description:
      "Book your guest spot on Stories That Lead. Share the revelation behind your leadership story.",
    type: "website",
    images: [
      {
        url: "/images/og-image-wide.jpg",
        width: 1200,
        height: 630,
        alt: "Be a Guest on Stories That Lead",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Be a Guest — Stories That Lead",
    description:
      "Book your guest spot on Stories That Lead. Share the revelation behind your leadership story.",
  },
};

export default function GuestPage() {
  return (
    <main className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-navy-dark/90 backdrop-blur-md border-b border-navy-light/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gold" />
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">STORIES THAT </span>
              <span className="text-gold">LEAD</span>
            </span>
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/episodes"
              className="text-gray-400 hover:text-gold text-sm transition-colors"
            >
              Episodes
            </a>
            <a
              href="/articles"
              className="text-gray-400 hover:text-gold text-sm transition-colors"
            >
              Articles
            </a>
            <a
              href="/"
              className="text-gray-400 hover:text-gold text-sm transition-colors"
            >
              Home
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-navy-light)_0%,_transparent_60%)] opacity-30" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Guest Booking
          </div>
          <h1
            className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Share Your <span className="text-gold">Revelation</span>
          </h1>
          <p className="text-gray-300 text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Every leader has a moment that changed how they think, communicate,
            or lead. I want to tell that story. Book a date, answer a few
            questions, and send me your assets — I&apos;ll handle the rest.
          </p>
        </div>
      </section>

      {/* ── What to Expect ── */}
      <section className="py-12 bg-navy border-y border-navy-light/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              {
                step: "01",
                title: "Pick a Date",
                description:
                  "Choose a recording time that works for your schedule.",
              },
              {
                step: "02",
                title: "Share Your Story",
                description:
                  "Answer a few questions so I can prepare the right conversation.",
              },
              {
                step: "03",
                title: "Send Your Assets",
                description:
                  "Upload your headshot, logo, and media kit for episode artwork.",
              },
            ].map((item) => (
              <div key={item.step} className="group">
                <span className="text-gold/40 text-xs font-mono tracking-wider">
                  {item.step}
                </span>
                <h3 className="text-white font-bold mt-1">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking + Form ── */}
      <section className="py-16 bg-navy-dark">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gradient-to-br from-navy via-navy-light/5 to-navy border border-navy-light/20 rounded-2xl p-8 lg:p-12">
            <GuestBookingClient />
          </div>
        </div>
      </section>

      {/* ── What Happens Next ── */}
      <section className="py-16 bg-navy">
        <div className="max-w-3xl mx-auto px-6">
          <div className="gold-divider mx-auto mb-6" />
          <h2
            className="text-2xl lg:text-3xl font-bold text-center mb-10"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            What Happens <span className="text-gold">Next</span>
          </h2>

          <div className="space-y-6">
            {[
              {
                title: "Confirmation email within 24 hours",
                description:
                  "With your recording date, a brief on the format, and technical requirements (it's simple — a good mic and a quiet room).",
              },
              {
                title: "I prep the conversation framework",
                description:
                  "Based on your answers, I'll build a Micro-Arc structure for the episode. You'll get a one-page outline before we record — no surprises.",
              },
              {
                title: "We record (45-60 minutes)",
                description:
                  "Conversational, not scripted. I guide the structure so you can focus on sharing your insight. Remote via Riverside.fm.",
              },
              {
                title: "I handle everything after",
                description:
                  "Editing, artwork, show notes, social clips, and distribution. You'll receive links to share with your network.",
              },
            ].map((item, i) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <span className="text-gold text-xs font-bold">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 bg-navy-dark border-t border-navy-light/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="font-bold text-sm tracking-tight">
                <span className="text-white">STORIES THAT </span>
                <span className="text-gold">LEAD</span>
              </span>
              <span className="text-gray-500 text-xs">
                &mdash; Not Conflict. Revelation.
              </span>
            </div>
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <a
                href="https://vernonross.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                VernonRoss.com
              </a>
              <span className="text-navy-light">|</span>
              <a
                href="https://www.linkedin.com/in/vernonross/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-navy-light/10 text-center text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Vernon Ross. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
