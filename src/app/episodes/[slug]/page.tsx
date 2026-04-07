import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEpisodeBySlug, getAllEpisodeSlugs } from "@/lib/episodes";
import { DocumentRenderer, type DocumentNode } from "@/lib/document-renderer";
import Link from "next/link";
import EpisodePlayer from "@/app/components/EpisodePlayer";

// Generate static params for all episodes
export function generateStaticParams() {
  const slugs = getAllEpisodeSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata per episode
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) return {};

  const title = `${episode.title} | Stories That Lead Ep. ${episode.episodeNumber}`;
  const description = episode.description;
  const keywords = episode.keywords
    ? episode.keywords.split(",").map((k: string) => k.trim())
    : [];

  return {
    title,
    description,
    keywords: [
      ...keywords,
      "Stories That Lead",
      "Vernon Ross",
      "leadership podcast",
      ...(episode.guestName ? [episode.guestName] : []),
    ],
    alternates: {
      canonical: `/episodes/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      images: [
        {
          url: episode.artworkUrl || episode.coverImage || "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${episode.title} - Stories That Lead Podcast`,
        },
      ],
      publishedTime: episode.publishDate,
      authors: ["Vernon Ross"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [episode.artworkUrl || episode.coverImage || "/images/og-image.jpg"],
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) notFound();

  const frameworksList = episode.frameworks
    ? episode.frameworks.split(",").map((f: string) => f.trim())
    : [];

  // PodcastEpisode schema markup
  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.description,
    episodeNumber: episode.episodeNumber,
    datePublished: episode.publishDate,
    duration: episode.duration,
    url: `https://www.storiesthatlead.co/episodes/${slug}`,
    image: episode.coverImage
      ? `https://www.storiesthatlead.co${episode.coverImage}`
      : "https://www.storiesthatlead.co/images/og-image.jpg",
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Stories That Lead",
      url: "https://www.storiesthatlead.co",
    },
    author: {
      "@type": "Person",
      name: "Vernon Ross",
      url: "https://vernonross.com",
    },
    ...(episode.audioUrl
      ? {
          associatedMedia: {
            "@type": "MediaObject",
            contentUrl: episode.audioUrl,
          },
        }
      : {}),
    ...(episode.guestName
      ? {
          contributor: {
            "@type": "Person",
            name: episode.guestName,
            ...(episode.guestTitle ? { jobTitle: episode.guestTitle } : {}),
            ...(episode.guestLinkedIn ? { url: episode.guestLinkedIn } : {}),
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
      />

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
                className="text-gray-400 hover:text-gold text-sm transition-colors"
              >
                Episodes
              </Link>
              <Link
                href="/articles"
                className="text-gray-400 hover:text-gold text-sm transition-colors"
              >
                Articles
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

        {/* Episode Header */}
        <section className="pt-28 pb-12 bg-gradient-to-b from-navy-dark via-navy to-navy-dark">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/episodes"
                className="text-gray-400 hover:text-gold text-sm transition-colors"
              >
                &larr; All Episodes
              </Link>
              <span className="text-navy-light">|</span>
              <span className="text-gold text-sm font-semibold">
                Episode {episode.episodeNumber}
              </span>
            </div>

            <h1
              className="text-3xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {episode.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-400">
              <time dateTime={episode.publishDate}>
                {new Date(episode.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-navy-light">•</span>
              <span>{episode.duration}</span>
              {episode.guestName && (
                <>
                  <span className="text-navy-light">•</span>
                  <span>
                    with{" "}
                    {episode.guestLinkedIn ? (
                      <a
                        href={episode.guestLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold-light transition-colors"
                      >
                        {episode.guestName}
                      </a>
                    ) : (
                      <span className="text-white">{episode.guestName}</span>
                    )}
                    {episode.guestTitle && (
                      <span className="text-gray-500">
                        , {episode.guestTitle}
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-300 text-lg mt-6 leading-relaxed max-w-3xl">
              {episode.description}
            </p>

            {/* Platform Links */}
            {(episode.appleUrl || episode.spotifyUrl || episode.youtubeUrl || episode.amazonUrl) && (
              <div className="flex flex-wrap gap-3 mt-6">
                {episode.appleUrl && (
                  <a
                    href={episode.appleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-light/30 border border-navy-light/30 rounded-lg text-sm text-gray-300 hover:border-gold/50 hover:text-gold transition-colors"
                  >
                    Apple Podcasts
                  </a>
                )}
                {episode.spotifyUrl && (
                  <a
                    href={episode.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-light/30 border border-navy-light/30 rounded-lg text-sm text-gray-300 hover:border-gold/50 hover:text-gold transition-colors"
                  >
                    Spotify
                  </a>
                )}
                {episode.youtubeUrl && (
                  <a
                    href={episode.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-light/30 border border-navy-light/30 rounded-lg text-sm text-gray-300 hover:border-gold/50 hover:text-gold transition-colors"
                  >
                    YouTube
                  </a>
                )}
                {episode.amazonUrl && (
                  <a
                    href={episode.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-light/30 border border-navy-light/30 rounded-lg text-sm text-gray-300 hover:border-gold/50 hover:text-gold transition-colors"
                  >
                    Amazon Music
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Audio Player */}
        {episode.audioUrl ? (
          <section className="pb-8">
            <div className="max-w-4xl mx-auto px-6">
              <EpisodePlayer
                audioUrl={episode.audioUrl}
                artworkUrl={episode.artworkUrl || '/images/og-image.jpg'}
                episodeNumber={episode.episodeNumber}
                title={episode.title}
                guestName={episode.guestName}
                guestTitle={episode.guestTitle}
                duration={episode.duration}
                publishDate={episode.publishDate}
                appleUrl={episode.appleUrl}
                spotifyUrl={episode.spotifyUrl}
                youtubeUrl={episode.youtubeUrl}
                amazonUrl={episode.amazonUrl}
              />
            </div>
          </section>
        ) : episode.embedCode ? (
          <section className="pb-8">
            <div className="max-w-4xl mx-auto px-6">
              <div
                className="rounded-xl overflow-hidden border border-navy-light/30 bg-navy/50"
                dangerouslySetInnerHTML={{ __html: episode.embedCode }}
              />
            </div>
          </section>
        ) : null}

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Show Notes - Main Column */}
              <div className="lg:col-span-3">
                {episode.showNotes ? (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-1 h-6 bg-gold rounded-full" />
                      Show Notes
                    </h2>
                    <div className="prose-stl">
                      <DocumentRenderer
                        document={episode.showNotes as DocumentNode[]}
                      />
                    </div>
                  </div>
                ) : null}

                {/* FAQ Section */}
                {episode.faq ? (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="w-1 h-6 bg-gold rounded-full" />
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      <div className="prose-stl bg-navy-light/20 rounded-xl p-6 border border-navy-light/20">
                        <DocumentRenderer
                          document={episode.faq as DocumentNode[]}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Transcript - Collapsible */}
                {episode.transcript ? (
                  <details className="mt-12 group">
                    <summary className="cursor-pointer text-2xl font-bold text-white mb-6 flex items-center gap-3 list-none">
                      <div className="w-1 h-6 bg-gold rounded-full" />
                      Full Transcript
                      <span className="text-sm text-gray-400 font-normal ml-auto group-open:rotate-180 transition-transform">
                        &#9660;
                      </span>
                    </summary>
                    <div className="mt-4 prose-stl">
                      <DocumentRenderer
                        document={episode.transcript as DocumentNode[]}
                      />
                    </div>
                  </details>
                ) : null}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                {/* Frameworks */}
                {frameworksList.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                      Frameworks Discussed
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {frameworksList.map((framework: string) => (
                        <span
                          key={framework}
                          className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-xs text-gold"
                        >
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Card */}
                <div className="bg-navy/50 border border-navy-light/20 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                    Never Miss an Episode
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Join the founding members list for early access and
                    exclusive frameworks.
                  </p>
                  <Link
                    href="/#signup"
                    className="block w-full px-4 py-3 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 text-center text-sm"
                  >
                    Get Insider Access
                  </Link>
                </div>

                {/* Guest Info */}
                {episode.guestName && (
                  <div className="mt-8 bg-navy/50 border border-navy-light/20 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                      Guest
                    </h3>
                    <p className="text-white font-semibold">
                      {episode.guestName}
                    </p>
                    {episode.guestTitle && (
                      <p className="text-gray-400 text-sm mt-1">
                        {episode.guestTitle}
                      </p>
                    )}
                    {episode.guestLinkedIn && (
                      <a
                        href={episode.guestLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-gold text-sm mt-2 hover:text-gold-light transition-colors"
                      >
                        LinkedIn &rarr;
                      </a>
                    )}
                  </div>
                )}
              </aside>
            </div>
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
              &copy; {new Date().getFullYear()} Vernon Ross. All rights
              reserved.
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
