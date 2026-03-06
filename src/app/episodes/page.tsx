import { Metadata } from "next";
import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";

export const metadata: Metadata = {
  title: "Episodes | Stories That Lead — Leadership Communication Podcast",
  description:
    "Browse all episodes of Stories That Lead. Leadership storytelling frameworks, AI implementation strategies, and executive communication insights with Vernon Ross.",
  alternates: {
    canonical: "/episodes",
  },
  openGraph: {
    title: "All Episodes | Stories That Lead",
    description:
      "Browse all episodes of Stories That Lead. Leadership storytelling frameworks, AI implementation strategies, and executive communication insights.",
    type: "website",
  },
};

export default function EpisodesPage() {
  const episodes = getAllEpisodes();

  return (
    <main className="min-h-screen bg-navy-dark">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-navy-dark/90 backdrop-blur-md border-b border-navy-light/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gold" />
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">STORIES THAT </span>
              <span className="text-gold">LEAD</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/episodes"
              className="text-gold text-sm font-semibold transition-colors"
            >
              Episodes
            </Link>
            <Link
              href="/#signup"
              className="px-5 py-2 bg-gold/10 border border-gold/30 text-gold text-sm font-semibold rounded-lg hover:bg-gold/20 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-navy-dark via-navy to-navy-dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="gold-divider mx-auto mb-6" />
          <h1
            className="text-4xl lg:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            All <span className="text-gold">Episodes</span>
          </h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
            Leadership frameworks, strategic storytelling, and AI implementation
            insights &mdash; structured how leaders actually think.
          </p>
        </div>
      </section>

      {/* Episodes List */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {episodes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-6">🎙️</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Episodes Coming Soon
              </h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Stories That Lead is launching soon. Join the founding members
                list to get early access to every episode.
              </p>
              <Link
                href="/#signup"
                className="inline-block px-8 py-4 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold/20 text-lg"
              >
                Get Early Access
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {episodes.map((episode) => (
                <Link
                  key={episode.slug}
                  href={`/episodes/${episode.slug}`}
                  className="block group"
                >
                  <article className="bg-navy/30 border border-navy-light/20 rounded-xl p-6 lg:p-8 hover:border-gold/30 transition-all duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gold/10 text-gold font-bold text-lg">
                          {episode.episodeNumber}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl lg:text-2xl font-bold text-white group-hover:text-gold transition-colors">
                          {episode.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                          <time dateTime={episode.publishDate}>
                            {new Date(episode.publishDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </time>
                          <span className="text-navy-light">•</span>
                          <span>{episode.duration}</span>
                          {episode.guestName && (
                            <>
                              <span className="text-navy-light">•</span>
                              <span>with {episode.guestName}</span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-400 mt-3 leading-relaxed line-clamp-2">
                          {episode.description}
                        </p>
                        {episode.frameworks && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {episode.frameworks
                              .split(",")
                              .slice(0, 3)
                              .map((f: string) => (
                                <span
                                  key={f.trim()}
                                  className="px-2 py-0.5 bg-gold/10 border border-gold/20 rounded-full text-xs text-gold"
                                >
                                  {f.trim()}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 self-center">
                        <span className="text-gold group-hover:translate-x-1 transition-transform inline-block">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-navy-dark border-t border-navy-light/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="font-bold text-sm tracking-tight">
                <span className="text-white">STORIES THAT </span>
                <span className="text-gold">LEAD</span>
              </span>
              <span className="text-gray-500 text-xs">
                &mdash; Not Conflict. Revelation.
              </span>
            </Link>
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
