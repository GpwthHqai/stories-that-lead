"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// ─── Countdown Timer Component ───────────────────────────────────────────────
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!mounted) {
    return (
      <div className="flex gap-4 justify-center">
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div key={label} className="text-center">
            <div className="bg-navy-light/50 border border-navy-light rounded-lg w-20 h-20 flex items-center justify-center">
              <span className="text-3xl font-bold text-gold">--</span>
            </div>
            <span className="text-xs text-gray-400 mt-2 block uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 justify-center">
      {units.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="bg-navy-light/50 border border-navy-light rounded-lg w-20 h-20 flex items-center justify-center">
            <span className="text-3xl font-bold text-gold">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-2 block uppercase tracking-wider">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Email Signup Form Component ─────────────────────────────────────────────
function EmailSignupForm({
  variant = "hero",
  buttonText = "Get Insider Access",
}: {
  variant?: "hero" | "lead-magnet" | "bottom";
  buttonText?: string;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      // SendFox API integration
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          source: variant,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setFirstName("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-gold/10 border border-gold/30 rounded-xl p-6 text-center">
        <div className="text-gold text-2xl mb-2">&#10003;</div>
        <p className="text-gold font-semibold text-lg">
          You&apos;re on the list.
        </p>
        <p className="text-gray-300 text-sm mt-1">
          Check your inbox for a welcome message with your founding member
          perks.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        {variant !== "hero" && (
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 bg-navy-light/60 border border-navy-light rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
          />
        )}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-navy-light/60 border border-navy-light rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full px-6 py-3 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-60 animate-pulse-gold"
        >
          {status === "loading" ? "Joining..." : buttonText}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-2 text-center">
          Something went wrong. Please try again.
        </p>
      )}
      <p className="text-gray-500 text-xs mt-3 text-center">
        No spam. Unsubscribe anytime. Your email stays private.
      </p>
    </form>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Minimal Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-navy-dark/90 backdrop-blur-md border-b border-navy-light/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gold" />
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">STORIES THAT </span>
              <span className="text-gold">LEAD</span>
            </span>
          </div>
          <a
            href="#signup"
            className="px-5 py-2 bg-gold/10 border border-gold/30 text-gold text-sm font-semibold rounded-lg hover:bg-gold/20 transition-colors"
          >
            Get Early Access
          </a>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-navy-light)_0%,_transparent_60%)] opacity-40" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                Coming March 2026
              </div>
            </div>

            <h1 className="animate-fade-in-up-delay-1">
              <span className="block text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="text-white">STORIES</span>
                <br />
                <span className="text-gold">THAT</span>
                <br />
                <span className="text-white">LEAD</span>
              </span>
            </h1>

            <div className="animate-fade-in-up-delay-2 mt-6">
              <div className="gold-divider mx-auto lg:mx-0 mb-4" />
              <p className="text-gray-300 text-sm uppercase tracking-[0.25em] font-medium">
                Not Conflict. Revelation.
              </p>
            </div>

            <p className="animate-fade-in-up-delay-2 text-gray-300 text-lg lg:text-xl mt-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              A podcast for communications leaders who are being asked to do
              more with AI — and need a framework, not a firehose.
            </p>

            <div className="animate-fade-in-up-delay-3 mt-8" id="signup">
              <EmailSignupForm
                variant="hero"
                buttonText="Get Insider Access"
              />
            </div>
          </div>

          {/* Right: Cover art */}
          <div className="animate-fade-in-up-delay-2 hidden lg:block">
            <div className="relative">
              <div className="absolute -left-3 top-8 bottom-8 w-1 bg-gradient-to-b from-gold via-gold-light to-transparent rounded-full" />
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-navy-light/30">
                <Image
                  src="/images/cover-square.webp"
                  alt="Stories That Lead Podcast — Vernon Ross"
                  width={600}
                  height={600}
                  priority
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Mobile cover */}
          <div className="animate-fade-in-up-delay-3 lg:hidden">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-navy-light/30 max-w-sm mx-auto">
              <Image
                src="/images/cover-square.webp"
                alt="Stories That Lead Podcast — Vernon Ross"
                width={400}
                height={400}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ── Countdown Section ── */}
      <section className="py-16 bg-navy border-y border-navy-light/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-6">
            Launching In
          </p>
          <CountdownTimer targetDate="2026-03-31T09:00:00-04:00" />
          <p className="text-gray-400 text-sm mt-8 max-w-md mx-auto">
            Join the founding members list for early episode access, exclusive
            content, and behind-the-scenes updates.
          </p>
        </div>
      </section>

      {/* ── Problem / Empathy Statement ── */}
      <section className="py-24 bg-navy-dark">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="gold-divider mx-auto mb-8" />
          <h2
            className="text-3xl lg:text-4xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Your team is being asked to do more with AI.
            <br />
            <span className="text-gold">
              You need a framework, not a firehose.
            </span>
          </h2>
          <p className="text-gray-300 text-lg mt-8 leading-relaxed max-w-2xl mx-auto">
            Every week, there&apos;s a new AI tool, a new mandate from
            leadership, and a team looking to you for direction. Most podcast
            content gives you hype. Stories That Lead gives you the strategic
            thinking and real-world frameworks that Fortune 500 communications
            leaders actually use.
          </p>
        </div>
      </section>

      {/* ── What You'll Get / Content Roadmap ── */}
      <section className="py-24 bg-navy">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="gold-divider mx-auto mb-6" />
            <h2
              className="text-3xl lg:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              What to Expect
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Select your path. Every episode delivers something different.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎙",
                title: "For Comms Leaders",
                description:
                  "AI implementation strategies, team workflow frameworks, and real case studies from Fortune 500 communications teams navigating the shift.",
              },
              {
                icon: "📊",
                title: "For Executives",
                description:
                  "Strategic insights on how AI is reshaping internal communications. The perspective shifts your team needs but can\u2019t articulate yet.",
              },
              {
                icon: "🛠",
                title: "For Practitioners",
                description:
                  "The Micro-Arc Framework, Voice Note Blueprint, and practical tools you can use Monday morning to produce better content faster.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-navy-dark/50 border border-navy-light/20 rounded-xl p-8 hover:border-gold/30 transition-colors group"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-400 mt-3 leading-relaxed text-sm">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Magnet Section ── */}
      <section className="py-24 bg-navy-dark" id="lead-magnet">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-navy via-navy-light/20 to-navy border border-navy-light/30 rounded-2xl p-8 lg:p-12 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs mb-4">
                FREE RESOURCE
              </div>
              <h2
                className="text-2xl lg:text-3xl font-bold leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                AI Readiness Assessment
                <br />
                <span className="text-gold">for Communications Teams</span>
              </h2>
              <p className="text-gray-300 mt-4 leading-relaxed">
                Where does your team stand on AI adoption? This checklist helps
                you identify gaps, prioritize tools, and build a 90-day
                implementation roadmap — without the overwhelm.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "25-point readiness assessment across 5 key dimensions",
                  "Scoring rubric with actionable next steps for each level",
                  "90-day quick-start implementation timeline",
                  "Tool recommendation matrix matched to team size",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-300 text-sm"
                  >
                    <span className="text-gold mt-0.5 flex-shrink-0">
                      &#10003;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="bg-navy-dark/60 rounded-xl p-6 border border-navy-light/20">
                <p className="text-center text-sm text-gray-400 mb-4">
                  Get instant access — delivered to your inbox.
                </p>
                <EmailSignupForm
                  variant="lead-magnet"
                  buttonText="Send Me the Checklist"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founding Member Perks ── */}
      <section className="py-24 bg-navy">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="gold-divider mx-auto mb-6" />
          <h2
            className="text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Founding Member <span className="text-gold">Perks</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
            Join before launch and get access others won&apos;t.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-12 text-left">
            {[
              {
                icon: "⚡",
                title: "Early Episode Access",
                description:
                  "Get every episode 48 hours before public release. Be the first to apply insights to your team.",
              },
              {
                icon: "🔒",
                title: "Exclusive Bonus Content",
                description:
                  "Extended interviews, framework deep-dives, and behind-the-scenes content only founding members receive.",
              },
              {
                icon: "💬",
                title: "Direct Access",
                description:
                  "Shape the show\u2019s direction. Submit questions, suggest guests, and get responses directly from Vernon.",
              },
              {
                icon: "📋",
                title: "AI Readiness Checklist",
                description:
                  "Immediate access to the AI Readiness Assessment for Communications Teams \u2014 a practical tool you can use today.",
              },
            ].map((perk) => (
              <div
                key={perk.title}
                className="bg-navy-dark/40 border border-navy-light/20 rounded-xl p-6 hover:border-gold/30 transition-colors"
              >
                <div className="text-2xl mb-3">{perk.icon}</div>
                <h3 className="text-lg font-bold text-white">{perk.title}</h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Vernon ── */}
      <section className="py-24 bg-navy-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="relative max-w-xs mx-auto lg:mx-0">
                <div className="absolute -left-3 top-4 bottom-4 w-1 bg-gradient-to-b from-gold to-transparent rounded-full" />
                <div className="rounded-2xl overflow-hidden border border-navy-light/30 shadow-xl">
                  <Image
                    src="/images/vernon-ross.webp"
                    alt="Vernon Ross — Host of Stories That Lead"
                    width={400}
                    height={540}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="gold-divider mb-6" />
              <h2
                className="text-3xl lg:text-4xl font-bold"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Meet <span className="text-gold">Vernon Ross</span>
              </h2>
              <p className="text-gray-300 mt-6 leading-relaxed text-lg">
                Enterprise Podcaster. Communications consultant to Fortune 500
                teams. Creator of the Micro-Arc Framework and Voice Note
                Blueprint — two proprietary methodologies that help
                organizations tell stories that drive understanding, not drama.
              </p>
              <p className="text-gray-400 mt-4 leading-relaxed">
                With over two decades in IT and enterprise communications,
                Vernon bridges the gap between AI capability and communications
                strategy. Stories That Lead is the show where these worlds
                converge — revealing how the best teams are adapting, what
                frameworks actually work, and why the future of corporate
                communications sounds nothing like the past.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  "Enterprise Communications",
                  "AI Strategy",
                  "Podcast Production",
                  "Fortune 500 Consulting",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-navy-light/30 border border-navy-light/30 rounded-full text-gray-300 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-24 bg-gradient-to-b from-navy to-navy-dark"
        id="join"
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="gold-divider mx-auto mb-8" />
          <h2
            className="text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Don&apos;t miss the first episode.
          </h2>
          <p className="text-gray-300 text-lg mt-4 max-w-lg mx-auto">
            Join the founding members list and be part of the launch.
            You&apos;ll get early access, exclusive content, and the AI
            Readiness Checklist — immediately.
          </p>
          <div className="mt-8">
            <EmailSignupForm
              variant="bottom"
              buttonText="Join the Founding Members"
            />
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
                — Not Conflict. Revelation.
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
