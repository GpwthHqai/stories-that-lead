import Image from "next/image";
import { CountdownTimer, EmailSignupForm, LeadershipAssessment, LaunchBadge } from "./components/ClientComponents";
import LatestEpisodes from "./components/LatestEpisodes";

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
              href="#signup"
              className="px-5 py-2 bg-gold/10 border border-gold/30 text-gold text-sm font-semibold rounded-lg hover:bg-gold/20 transition-colors"
            >
              Get Early Access
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-navy-light)_0%,_transparent_60%)] opacity-40" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="animate-fade-in-up">
              <LaunchBadge targetDate="2026-03-31T09:00:00-04:00" />
            </div>

            <h1 className="sr-only">Stories That Lead — A Leadership Communication Podcast with Vernon Ross</h1>
            <div className="animate-fade-in-up-delay-1" aria-hidden="true">
              <span className="block text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="text-white">STORIES</span>
                <br />
                <span className="text-gold">THAT</span>
                <br />
                <span className="text-white">LEAD</span>
              </span>
            </div>

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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs text-gray-400 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ── Countdown / Now Live Section ── */}
      <section className="py-16 bg-navy border-y border-navy-light/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <CountdownTimer targetDate="2026-03-31T09:00:00-04:00" />
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
              Every episode delivers executive communication frameworks you can use Monday morning &mdash; how leaders tell transformation stories and turn insight into action.
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
                    alt="Vernon Ross — Host of Stories That Lead"
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

      {/* ── Latest Episodes (only shows when episodes exist) ── */}
      <LatestEpisodes />

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
