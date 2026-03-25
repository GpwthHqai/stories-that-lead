"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Launch-Aware Badge ──────────────────────────────────────────────────────
export function LaunchBadge({
  targetDate,
  preText = "Coming March 2026",
  liveText = "Now Live",
}: {
  targetDate: string;
  preText?: string;
  liveText?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExpired(new Date(targetDate).getTime() - new Date().getTime() <= 0);
  }, [targetDate]);

  const text = !mounted ? preText : expired ? liveText : preText;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
      {text}
    </div>
  );
}

// ─── Countdown Timer Component ───────────────────────────────────────────────
export function CountdownTimer({ targetDate }: { targetDate: string }) {
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

  const isExpired = useCallback(() => {
    return new Date(targetDate).getTime() - new Date().getTime() <= 0;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExpired(isExpired());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      if (isExpired()) setExpired(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft, isExpired]);

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

  // ── Post-Launch State ──
  if (expired) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          Now Live
        </div>
        <h3
          className="text-2xl lg:text-3xl font-bold mb-4"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Stories That Lead is <span className="text-gold">Live</span>
        </h3>
        <p className="text-gray-300 text-lg max-w-md mx-auto mb-8 leading-relaxed">
          Leaders are already sharing the frameworks behind the moments that
          changed everything. Listen now.
        </p>
        <a
          href="/episodes"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#ce3c06] hover:bg-[#a52f05] text-white font-bold rounded-lg transition-colors text-lg"
        >
          Browse Episodes
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    );
  }

  // ── Pre-Launch Countdown ──
  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div>
      <p className="text-gray-400 text-sm uppercase tracking-wider mb-6">
        Launching In
      </p>
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
      <p className="text-gray-400 text-sm mt-8 max-w-md mx-auto">
        Join the founding members list for early episode access, exclusive
        frameworks, and behind-the-scenes updates.
      </p>
    </div>
  );
}

// ─── Email Signup Form Component ─────────────────────────────────────────────
export function EmailSignupForm({
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
  key: string;
  type: string;
  emoji: string;
  description: string;
  recommendations: string[];
  cta: string;
};

const profileKey = [
  "narrator",
  "pioneer",
  "builder",
  "movement",
  "architect",
  "voice",
] as const;
type ProfileKey = (typeof profileKey)[number];

const scoringMatrix: number[][][] = [
  [[0, 0, 0, 2, 1, 3], [1, 0, 1, 0, 3, 1], [0, 2, 3, 0, 1, 0], [2, 1, 0, 3, 0, 0]],
  [[0, 4, 1, 0, 0, 0], [4, 0, 0, 0, 1, 0], [0, 0, 0, 4, 0, 1], [0, 0, 3, 0, 0, 2]],
  [[0, 0, 2, 0, 2, 0], [0, 0, 0, 2, 0, 2], [3, 1, 0, 0, 0, 0], [0, 0, 4, 0, 1, 0]],
  [[2, 0, 0, 1, 0, 0], [0, 2, 1, 0, 0, 0], [0, 3, 0, 0, 1, 0], [0, 0, 0, 0, 2, 2]],
  [[4, 0, 0, 0, 0, 0], [0, 4, 0, 0, 0, 0], [0, 0, 2, 0, 0, 3], [0, 0, 0, 4, 1, 0]],
];

const profiles: Record<ProfileKey, ProfileResult> = {
  narrator: {
    key: "narrator",
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
  },
  pioneer: {
    key: "pioneer",
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
  },
  builder: {
    key: "builder",
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
  },
  movement: {
    key: "movement",
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
  },
  architect: {
    key: "architect",
    type: "The Transformation Architect",
    emoji: "\uD83D\uDD27",
    description:
      "You\u2019re in the middle of leading real organizational change \u2014 not theorizing about it. You need a playbook for navigating disruption while keeping your team aligned and moving forward.",
    recommendations: [
      "Episodes on leading teams through large-scale transitions",
      "The Micro-Arc Framework for communicating change without creating panic",
      "Case studies on leaders who turned organizational disruption into strategic advantage",
    ],
    cta: "Let\u2019s build your transformation communication playbook.",
  },
  voice: {
    key: "voice",
    type: "The Voice of Authority",
    emoji: "\uD83C\uDF99\uFE0F",
    description:
      "You\u2019ve built the expertise and led at the highest levels. Now you need a system to capture that thinking, scale it beyond your immediate circle, and build a lasting body of work.",
    recommendations: [
      "The Voice Note Blueprint for turning leadership insights into scalable content",
      "Episodes on building thought leadership platforms from enterprise experience",
      "Framework episodes on institutional knowledge capture and distribution",
    ],
    cta: "Let\u2019s build the system that scales your leadership voice.",
  },
};

function getProfile(answers: number[]): ProfileResult {
  const scores: Record<ProfileKey, number> = {
    narrator: 0, pioneer: 0, builder: 0, movement: 0, architect: 0, voice: 0,
  };
  for (let q = 0; q < 5; q++) {
    const a = answers[q] ?? 0;
    const weights = scoringMatrix[q]?.[a];
    if (weights) {
      profileKey.forEach((key, i) => { scores[key] += weights[i]; });
    }
  }
  let topKey: ProfileKey = "narrator";
  let topScore = -1;
  for (const key of profileKey) {
    if (scores[key] > topScore) { topScore = scores[key]; topKey = key; }
  }
  return profiles[topKey];
}

export function LeadershipAssessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
      const profileResult = getProfile(answers);
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, first_name: firstName, source: "assessment", profile: profileResult.key,
        }),
      });
      if (response.ok) { setStatus("success"); setStep(7); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  if (step === 0) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs mb-6">
          2-MINUTE ASSESSMENT
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Discover Your{" "}<span className="text-gold">Leadership Story Framework</span>
        </h3>
        <p className="text-gray-300 mt-4 max-w-lg mx-auto leading-relaxed">
          Answer 5 quick questions to uncover which storytelling and leadership
          framework fits your role &mdash; plus get personalized episode
          recommendations when we launch.
        </p>
        <button onClick={() => setStep(1)} className="mt-8 px-8 py-4 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 text-lg">
          Start the Assessment
        </button>
      </div>
    );
  }

  if (step >= 1 && step <= 5) {
    const q = assessmentQuestions[step - 1];
    return (
      <div>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-gold text-sm font-semibold">{step}/5</span>
          <div className="flex-1 h-1.5 bg-navy-light/30 rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">{q.question}</h3>
        <div className="grid gap-3">
          {q.options.map((option, i) => (
            <button key={i} onClick={() => handleAnswer(i)}
              className={`w-full text-left px-6 py-4 border rounded-xl transition-all duration-200 group ${
                selectedAnswer === i ? "bg-gold/10 border-gold/50 text-gold" : "bg-navy-dark/60 border-navy-light/30 text-gray-200 hover:border-gold/50 hover:bg-navy-dark/80"
              }`}>
              <span className={`transition-colors ${selectedAnswer === i ? "text-gold" : "group-hover:text-gold"}`}>{option}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">&#10024;</div>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Your results are ready.</h3>
        <p className="text-gray-300 mb-6">Enter your email to see your personalized leadership framework profile and get founding member access.</p>
        <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-navy-dark/60 border border-navy-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors" />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 bg-navy-dark/60 border border-navy-light/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold transition-colors" />
            <button type="submit" disabled={status === "loading"}
              className="w-full px-6 py-3 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 disabled:opacity-60">
              {status === "loading" ? "Loading..." : "See My Results"}
            </button>
          </div>
          {status === "error" && <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>}
          <p className="text-gray-500 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </form>
      </div>
    );
  }

  if (step === 7) {
    const profile = getProfile(answers);
    return (
      <div>
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{profile.emoji}</div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm mb-4">YOUR PROFILE</div>
          <h3 className="text-2xl lg:text-3xl font-bold text-gold" style={{ fontFamily: "var(--font-playfair), serif" }}>{profile.type}</h3>
          <p className="text-gray-300 mt-4 max-w-lg mx-auto leading-relaxed">{profile.description}</p>
        </div>
        <div className="bg-navy-dark/60 border border-navy-light/20 rounded-xl p-6 mb-8">
          <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-4">Your Recommended Starting Point</h4>
          <ul className="space-y-3">
            {profile.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                <span className="text-gold mt-0.5 flex-shrink-0">&#10003;</span>{rec}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <p className="text-gray-300 mb-4">{profile.cta}</p>
          <a href="https://bookme.name/vernon/lite/ai-strategy-framework" target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 text-lg">
            Book Your Strategy Session
          </a>
          <p className="text-gray-500 text-xs mt-3">Free 45-minute session. No pitch. Just frameworks.</p>
        </div>
      </div>
    );
  }

  return null;
}
