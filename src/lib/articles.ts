import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export interface Article {
  slug: string;
  title: string;
  publishDate: string;
  author: string;
  description: string;
  category?: string;
  tags?: string;
  keywords?: string;
  featuredImage?: string | null;
  seoTitle?: string;
  canonicalUrl?: string;
  body: unknown;
}

const ARTICLES_DIR = join(process.cwd(), "content", "articles");

export function getAllArticles(): Article[] {
  if (!existsSync(ARTICLES_DIR)) return [];
  try {
    const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
    const articles = files
      .map((file) => {
        const slug = file.replace(".json", "");
        const data = JSON.parse(readFileSync(join(ARTICLES_DIR, file), "utf-8"));
        return { slug, ...data } as Article;
      })
      .filter((article) => {
        const pubDate = new Date(article.publishDate);
        return pubDate <= new Date();
      })
      .sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );
    return articles;
  } catch {
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = join(ARTICLES_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;
  try {
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return { slug, ...data } as Article;
  } catch {
    return null;
  }
}

export function getAllArticleSlugs(): string[] {
  if (!existsSync(ARTICLES_DIR)) return [];
  try {
    return readdirSync(ARTICLES_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}
