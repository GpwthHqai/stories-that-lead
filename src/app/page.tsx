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

// ─── Leadership Framework Assessment ─────────────────────────────────────────
const assessmentQuestions = [
  {
    question: "What best describes your role?",
    options: [
      "C-Suite / Senior Executive",
      "VP / Director",
      "Manager / Team Lead",
      "Founder / Entrepreneur",
    ],
  },
  {
    question:
      "What\u2019s the biggest challenge you\u2019re navigating right now?",
    options: [
      "Leading my team through AI disruption",
      "Telling my organization\u2019s story during change",
      "Getting leadership buy-in for new initiatives",
      "Scaling my team\u2019s impact without scaling headcount",
    ],
  },
  {
    question:
      "How does your team currently share big decisions or changes?",
    options: [
      "Email blasts and memos",
      "Town halls and all-hands meetings",
      "Podcasts, video, or audio content",
      "We don\u2019t have a structured approach",
    ],
  },
  {
    question:
      "How would you describe your organization\u2019s relationship with AI?",
    options: [
      "We haven\u2019t started yet",
      "We\u2019re experimenting with a few tools",
      "We\u2019ve integrated AI into some workflows",
      "AI is embedded in most of what we do",
    ],
  },
  {
    question: "What would make the biggest difference for you right now?",
    options: [
      "A framework for storytelling that doesn\u2019t feel corporate",
      "Practical AI implementation strategies for my team",
      "A way to capture and scale leadership thinking",
      "A community of leaders navigating the same challenges",
    ],
  },
];

type ProfileResult = {
  type: string;
  emoji: string;
  description: string;
  recommendations: string[];
  cta: string;
};

function getProfile(answers: number[]): ProfileResult {
  const challenge = answers[1] ?? 0;
  const difference = answers[4] ?? 0;

  if (challenge === 1 || difference === 0) {
    return {
      type: "The Strategic Narrator",
      emoji: "\uD83C\uDFAF",
      description:
        "You see the power of story in leadership but need a framework that matches how leaders actually think \u2014 not Hollywood screenwriting templates.",
      recommendations: [
        "The Micro-Arc Framework deep-dive episodes",
        "Case studies on revelation-based leadership storytelling",
        "Guest interviews with leaders who transformed organizations through narrative",
      ],
      cta: "Let\u2019s map your leadership story to the Micro-Arc Framework.",
    };
  }

  if (challenge === 0 || difference === 1) {
    return {
      type: "The AI Pioneer",
      emoji: "\u26A1",
      description:
        "You\u2019re leading your team through AI disruption and need practical strategies \u2014 not hype. You want to know what\u2019s actually working inside organizations like yours.",
      recommendations: [
        "AI implementation case studies from Fortune 500 teams",
        "The Voice Note Blueprint for AI-assisted content creation",
        "Framework episodes on building AI-ready teams",
      ],
      cta: "Let\u2019s build your team\u2019s AI implementation roadmap.",
    };
  }

  if (challenge === 3 || difference === 2) {
    return {
      type: "The Framework Builder",
      emoji: "\uD83C\uDFD7\uFE0F",
      description:
        "You need structured systems to scale your leadership thinking across teams. Ad hoc isn\u2019t cutting it anymore \u2014 you need repeatable frameworks.",
      recommendations: [
        "The Voice Note Blueprint for capturing leadership insights at scale",
        "Enterprise workflow optimization episodes",
        "Framework episodes on systemizing team communication",
      ],
      cta: "Let\u2019s design the framework your team needs.",
    };
  }

  return {
    type: "The Movement Maker",
    emoji: "\uD83D\uDE80",
    description:
      "You\u2019re not just leading a team \u2014 you\u2019re building a movement. You need to get buy-in, build community, and scale your influence beyond your immediate circle.",
    recommendations: [
      "Episodes on leadership buy-in and organizational change",
      "Case studies on leaders who built movements inside enterprises",
      "Community and direct access through founding membership",
    ],
    cta: "Let\u2019s talk about scaling your leadership impact.",
  };
}

function LeadershipAssessment() {
  // 0 = intro, 1-5 = questions, 6 = email capture, 7 = results
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setTimeout(() => {
      setAnswers((prev) => [...prev, answerIndex]);
      setStep((prev) => prev + 1);
      setSelectedAnswer(null);
    }, 300);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName,
          source: "assessment",
        }),
      });
      if (response.ok) {
        setStatus("success");
        setStep(7);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // Intro
  if (step === 0) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs mb-6">
          2-MINUTE ASSESSMENT
        </div>
        <h3
          className="text-2xl lg:text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Discover Your{" "}
          <span className="text-gold">Leadership Story Framework</span>
        </h3>
        <p className="text-gray-300 mt-4 max-w-lg mx-auto leading-relaxed">
          Answer 5 quick questions to uncover which storytelling and leadership
          framework fits your role &mdash; plus get personalized episode
          recommendations when we launch.
        </p>
        <button
          onClick={() => setStep(1)}
          className="mt-8 px-8 py-4 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 text-lg"
        >
          Start the Assessment
        </button>
      </div>
    );
  }

  // Questions
  if (step >= 1 && step <= 5) {
    const q = assessmentQuestions[step - 1];
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-gold text-sm font-semibold">{step}/5</span>
          <div className="flex-1 h-1.5 bg-navy-light/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">
          {q.question}
        </h3>

        <div className="grid gap-3">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className={`w-full text-left px-6 py-4 border rounded-xl transition-all duration-200 group ${
                selectedAnswer === i
                  ? "bg-gold/10 border-gold/50 text-gold"
                  : "bg-navy-dark/60 border-navy-light/30 text-gray-200 hover:border-gold/50 hover:bg-navy-dark/80"
              }`}
            >
              <span
                className={`transition-colors ${
                  selectedAnswer === i
                    ? "text-gold"
                    : "group-hover:text-gold"
                }`}
              >
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Email capture
  if (step === 6) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">&#10024;</div>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
          Your results are ready.
        </h3>
        <p className="text-gray-300 mb-6">
          Enter your email to see your personalized leadership framework
          profile and get founding member access.
        </p>
        <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-navy-dark/60 border border-navy-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-navy-dark/60 border border-navy-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-3 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-60"
            >
              {status === "loading" ? "Loading..." : "See My Results"}
            </button>
          </div>
          {status === "error" && (
            <p className="text-red-400 text-sm mt-2">
              Something went wrong. Please try again.
            </p>
          )}
          <p className="text-gray-500 text-xs mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </form>
      </div>
    );
  }

  // Results
  if (step === 7) {
    const profile = getProfile(answers);
    return (
      <div>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{profile.emoji}</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-4">
            YOUR PROFILE
          </div>
          <h3
            className="text-2xl lg:text-3xl font-bold text-gold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {profile.type}
          </h3>
          <p className="text-gray-300 mt-4 max-w-lg mx-auto leading-relaxed">
            {profile.description}
          </p>
        </div>

        <div className="bg-navy-dark/60 border border-navy-light/20 rounded-xl p-6 mb-8">
          <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">
            Your Recommended Starting Point
          </h4>
          <ul className="space-y-3">
            {profile.recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-gray-300 text-sm"
              >
                <span className="text-gold mt-0.5 flex-shrink-0">
                  &#10003;
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-300 mb-4">{profile.cta}</p>
          <a
            href="https://bookme.name/vernon/lite/ai-strategy-framework"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 text-lg"
          >
            Book Your Strategy Session
          </a>
          <p className="text-gray-500 text-xs mt-3">
            Free 45-minute session. No pitch. Just frameworks.
          </p>
        </div>
      </div>
    );
  }

  return null;
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
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-navy-light)_0%,_transparent_60%)] opacity-40" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
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
              Leaders reveal the frameworks behind the moments that changed
              everything. Stories structured how leaders actually think.
            </p>

            <div className="animate-fade-in-up-delay-3 mt-8" id="signup">
              <EmailSignupForm
                variant="hero"
                buttonText="Get Insider Access"
              />
            </div>
          </div>

          {/* Desktop cover art */}
          <div className="animate-fade-in-up-delay-2 hidden lg:block">
            <div className="relative">
              <div className="absolute -left-3 top-8 bottom-8 w-1 bg-gradient-to-b from-gold via-gold-light to-transparent rounded-full" />
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-navy-light/30">
                <Image
                  src="/images/cover-square.webp"
                  alt="Stories That Lead Podcast \u2014 Vernon Ross"
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
                alt="Stories That Lead Podcast \u2014 Vernon Ross"
                width={400}
                height={400}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

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
            frameworks, and behind-the-scenes updates.
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
            Every leader has a moment that changed everything.
            <br />
            <span className="text-gold">
              Most never learn to tell that story.
            </span>
          </h2>
          <p className="text-gray-300 text-lg mt-8 leading-relaxed max-w-2xl mx-auto">
            The decision under pressure. The transformation that worked. The
            framework others need but can&apos;t find. Most podcasts chase
            conflict and drama. Stories That Lead chases the revelation &mdash;
            the strategic thinking and real-world frameworks behind pivotal
            leadership moments.
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
              Every episode delivers frameworks you can use Monday morning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "\uD83C\uDFAF",
                title: "Leadership Frameworks",
                description:
                  "Real frameworks from leaders who\u2019ve navigated transformation. Not theory \u2014 the actual decision-making processes behind pivotal moments.",
              },
              {
                icon: "\uD83C\uDFA4",
                title: "Strategic Storytelling",
                description:
                  "The Micro-Arc Framework: a revelation-based storytelling structure adapted from Kish\u014Dtenketsu. Stories built around insight, not conflict.",
              },
              {
                icon: "\u26A1",
                title: "AI Implementation",
                description:
                  "Practical strategies for integrating AI into your team\u2019s workflow. What\u2019s actually working inside Fortune 500 organizations right now.",
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

      {/* ── Interactive Assessment ── */}
      <section className="py-24 bg-navy-dark" id="assessment">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gradient-to-br from-navy via-navy-light/10 to-navy border border-navy-light/30 rounded-2xl p-8 lg:p-12">
            <LeadershipAssessment />
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
                icon: "\u26A1",
                title: "Early Episode Access",
                description:
                  "Get every episode 48 hours before public release. Be the first to apply frameworks to your team.",
              },
              {
                icon: "\uD83D\uDD12",
                title: "Exclusive Bonus Content",
                description:
                  "Extended interviews, framework deep-dives, and behind-the-scenes content only founding members receive.",
              },
              {
                icon: "\uD83D\uDCAC",
                title: "Direct Access",
                description:
                  "Shape the show\u2019s direction. Submit questions, suggest guests, and get responses directly from Vernon.",
              },
              {
                icon: "\uD83C\uDFAF",
                title: "Leadership Framework Assessment",
                description:
                  "Immediate access to the personalized assessment that matches your leadership profile to the right frameworks and episodes.",
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

      {/* ── Why I Built This ── */}
      <section className="py-24 bg-navy-dark">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="relative max-w-xs mx-auto lg:mx-0">
                <div className="absolute -left-3 top-4 bottom-4 w-1 bg-gradient-to-b from-gold to-transparent rounded-full" />
                <div className="rounded-2xl overflow-hidden border border-navy-light/30 shadow-xl">
                  <Image
                    src="/images/vernon-ross.webp"
                    alt="Vernon Ross \u2014 Host of Stories That Lead"
                    width={800}
                    height={1066}
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
                Why I <span className="text-gold">Built This</span>
              </h2>
              <p className="text-gray-300 mt-6 leading-relaxed text-lg">
                Most business storytelling borrows from Hollywood &mdash;
                hero&apos;s journey, conflict arcs, dramatic tension. It works
                for movies. It fails for leaders.
              </p>
              <p className="text-gray-400 mt-4 leading-relaxed">
                When a CEO announces a strategic pivot, the team doesn&apos;t
                need drama. They need to understand <em>why</em>. When a leader
                shares the framework behind a transformation, people don&apos;t
                need a villain. They need the revelation.
              </p>
              <p className="text-gray-400 mt-4 leading-relaxed">
                I spent 22 years in enterprise IT watching brilliant leaders
                struggle to tell their stories because every framework handed to
                them was built for screenwriters, not strategists. So I built
                one that works differently &mdash; the Micro-Arc Framework
                structures narrative around revelation instead of conflict,
                adapted from Kish&#333;tenketsu, the four-act structure
                that&apos;s driven Japanese storytelling for centuries.
              </p>
              <p className="text-gray-300 mt-4 leading-relaxed font-medium">
                Stories That Lead is where these ideas come to life. Real
                leaders. Real frameworks. Real moments of revelation.
              </p>
              <div className="mt-6">
                <span className="text-gold font-bold">
                  &mdash; Vernon Ross
                </span>
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
            You&apos;ll get early access, exclusive frameworks, and your
            personalized leadership assessment &mdash; immediately.
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
