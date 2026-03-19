import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/articles";
import { DocumentRenderer, type DocumentNode } from "@/lib/document-renderer";
import Link from "next/link";

export function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.description;
  const keywords = article.keywords
    ? article.keywords.split(",").map((k: string) => k.trim())
    : [];

  return {
    title: `${title} | Stories That Lead`,
    description,
    keywords: [
      ...keywords,
      "Stories That Lead",
      "Vernon Ross",
    ],
    alternates: {
      canonical: article.canonicalUrl || `/articles/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      images: [
        {
          url: article.featuredImage || "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${article.title} — Stories That Lead`,
        },
      ],
      publishedTime: article.publishDate,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.featuredImage || "/images/og-image.jpg"],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const tagsList = article.tags
    ? article.tags.split(",").map((t: string) => t.trim())
    : [];

  // Article schema markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    url: `https://www.storiesthatlead.co/articles/${slug}`,
    image: article.featuredImage
      ? `https://www.storiesthatlead.co${article.featuredImage}`
      : "https://www.storiesthatlead.co/images/og-image.jpg",
    author: {
      "@type": "Person",
      name: article.author,
      url: "https://vernonross.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Stories That Lead",
      url: "https://www.storiesthatlead.co",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.storiesthatlead.co/articles/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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

        {/* Article Header */}
        <section className="pt-28 pb-12 bg-gradient-to-b from-navy-dark via-navy to-navy-dark">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/articles"
                className="text-gray-400 hover:text-gold text-sm transition-colors"
              >
                &larr; All Articles
              </Link>
              {article.category && (
                <>
                  <span className="text-navy-light">|</span>
                  <span className="text-gold text-sm font-semibold">
                    {article.category}
                  </span>
                </>
              )}
            </div>

            <h1
              className="text-3xl lg:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-400">
              <time dateTime={article.publishDate}>
                {new Date(article.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="text-navy-light">•</span>
              <span>By {article.author}</span>
            </div>

            <p className="text-gray-300 text-lg mt-6 leading-relaxed max-w-3xl">
              {article.description}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Article Body - Main Column */}
              <div className="lg:col-span-3">
                {article.body ? (
                  <div className="prose-stl">
                    <DocumentRenderer
                      document={article.body as DocumentNode[]}
                    />
                  </div>
                ) : null}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                {/* Tags */}
                {tagsList.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                      Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tagsList.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-xs text-gold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Card */}
                <div className="bg-navy/50 border border-navy-light/20 rounded-xl p-6">
                  <h3 className="text-sm font-semibold text-gold uppercase tracking-wider mb-3">
                    Never Miss an Article
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Join the founding members list for early access to guides,
                    frameworks, and episodes.
                  </p>
                  <Link
                    href="/#signup"
                    className="block w-full px-4 py-3 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200 text-center text-sm"
                  >
                    Get Insider Access
                  </Link>
                </div>
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
