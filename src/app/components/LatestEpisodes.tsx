import Link from "next/link";
import { getAllEpisodes } from "@/lib/episodes";

export default function LatestEpisodes() {
  const episodes = getAllEpisodes().slice(0, 3);

  if (episodes.length === 0) return null;

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="mx-auto mb-6"
            style={{
              width: "60px",
              height: "3px",
              background: "linear-gradient(90deg, #cba34c, #e0be6a)",
            }}
          />
          <h2
            className="text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Latest <span className="text-gold">Episodes</span>
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Leadership frameworks and strategic storytelling &mdash; structured
            how leaders actually think.
          </p>
        </div>

        <div className="space-y-4">
          {episodes.map((episode) => (
            <Link
              key={episode.slug}
              href={`/episodes/${episode.slug}`}
              className="block group"
            >
              <article className="bg-navy-dark/50 border border-navy-light/20 rounded-xl p-6 hover:border-gold/30 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gold/10 text-gold font-bold text-sm">
                    {episode.episodeNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-gold transition-colors">
                      {episode.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                      <time dateTime={episode.publishDate}>
                        {new Date(episode.publishDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </time>
                      <span className="text-navy-light">&bull;</span>
                      <span>{episode.duration}</span>
                      {episode.guestName && (
                        <>
                          <span className="text-navy-light">&bull;</span>
                          <span>with {episode.guestName}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-400 mt-2 text-sm line-clamp-2">
                      {episode.description}
                    </p>
                  </div>
                  <span className="flex-shrink-0 self-center text-gold group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/episodes"
            className="inline-block px-8 py-3 bg-gold/10 border border-gold/30 text-gold font-semibold rounded-lg hover:bg-gold/20 transition-colors"
          >
            View All Episodes
          </Link>
        </div>
      </div>
    </section>
  );
}
