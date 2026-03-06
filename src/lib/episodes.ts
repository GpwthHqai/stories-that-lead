import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export interface Episode {
  slug: string;
  title: string;
  episodeNumber: number;
  publishDate: string;
  description: string;
  guestName?: string;
  guestTitle?: string;
  guestLinkedIn?: string;
  duration: string;
  coverImage?: string | null;
  embedCode?: string;
  appleUrl?: string;
  spotifyUrl?: string;
  amazonUrl?: string;
  keywords?: string;
  frameworks?: string;
  showNotes: unknown;
  transcript: unknown;
}

const EPISODES_DIR = join(process.cwd(), "content", "episodes");

export function getAllEpisodes(): Episode[] {
  if (!existsSync(EPISODES_DIR)) return [];
  try {
    const files = readdirSync(EPISODES_DIR).filter((f) => f.endsWith(".json"));
    const episodes = files
      .map((file) => {
        const slug = file.replace(".json", "");
        const data = JSON.parse(readFileSync(join(EPISODES_DIR, file), "utf-8"));
        return { slug, ...data } as Episode;
      })
      .filter((ep) => {
        // Only show published episodes (publish date <= today)
        const pubDate = new Date(ep.publishDate);
        return pubDate <= new Date();
      })
      .sort((a, b) => b.episodeNumber - a.episodeNumber);
    return episodes;
  } catch {
    return [];
  }
}

export function getEpisodeBySlug(slug: string): Episode | null {
  const filePath = join(EPISODES_DIR, `${slug}.json`);
  if (!existsSync(filePath)) return null;
  try {
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    return { slug, ...data } as Episode;
  } catch {
    return null;
  }
}

export function getAllEpisodeSlugs(): string[] {
  if (!existsSync(EPISODES_DIR)) return [];
  try {
    return readdirSync(EPISODES_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(".json", ""));
  } catch {
    return [];
  }
}
