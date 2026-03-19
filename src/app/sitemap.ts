import { MetadataRoute } from "next";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

function getEpisodeSlugs(): string[] {
  const episodesDir = join(process.cwd(), "content", "episodes");
  if (!existsSync(episodesDir)) return [];
  try {
    return readdirSync(episodesDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

function getEpisodeDate(slug: string): Date {
  try {
    const filePath = join(process.cwd(), "content", "episodes", `${slug}.json`);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return new Date(data.publishDate || Date.now());
  } catch {
    return new Date();
  }
}

function getArticleSlugs(): string[] {
  const articlesDir = join(process.cwd(), "content", "articles");
  if (!existsSync(articlesDir)) return [];
  try {
    return readdirSync(articlesDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}

function getArticleDate(slug: string): Date {
  try {
    const filePath = join(process.cwd(), "content", "articles", `${slug}.json`);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return new Date(data.publishDate || Date.now());
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.storiesthatlead.co";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/episodes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const episodeSlugs = getEpisodeSlugs();
  const episodePages: MetadataRoute.Sitemap = episodeSlugs.map((slug) => ({
    url: `${baseUrl}/episodes/${slug}`,
    lastModified: getEpisodeDate(slug),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articleSlugs = getArticleSlugs();
  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: getArticleDate(slug),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...episodePages, ...articlePages];
}
