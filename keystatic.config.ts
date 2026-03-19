import { config, fields, collection } from "@keystatic/core";

// Use the NEXT_PUBLIC_ slug var to determine mode — it's the only
// Keystatic env var available on both server AND client (baked in at
// build time). Without this, the client-side config falls into local
// mode and never shows the GitHub login screen.
const useGitHub = !!process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG;

export default config({
  storage: useGitHub
    ? {
        kind: "github",
        repo: "GpwthHqai/stories-that-lead",
      }
    : {
        kind: "local",
      },
  collections: {
    episodes: collection({
      label: "Episodes",
      slugField: "title",
      path: "content/episodes/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({
          name: { label: "Episode Title", validation: { isRequired: true } },
        }),
        episodeNumber: fields.integer({
          label: "Episode Number",
          validation: { isRequired: true },
        }),
        publishDate: fields.date({
          label: "Publish Date",
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: "Short Description (for cards & meta)",
          multiline: true,
          validation: { isRequired: true },
        }),
        guestName: fields.text({
          label: "Guest Name",
          description: "Leave blank for solo episodes",
        }),
        guestTitle: fields.text({
          label: "Guest Title & Company",
          description: "e.g. 'VP of Communications, Acme Corp'",
        }),
        guestLinkedIn: fields.url({
          label: "Guest LinkedIn URL",
        }),
        duration: fields.text({
          label: "Episode Duration",
          description: "e.g. '42 min'",
          validation: { isRequired: true },
        }),
        coverImage: fields.image({
          label: "Episode Cover Image",
          directory: "public/images/episodes",
          publicPath: "/images/episodes",
          description: "Optional episode-specific image. Falls back to podcast cover.",
        }),
        embedCode: fields.text({
          label: "Podcast Player Embed Code",
          multiline: true,
          description: "Paste the full iframe/embed code from Hypecast",
        }),
        appleUrl: fields.url({
          label: "Apple Podcasts URL",
        }),
        spotifyUrl: fields.url({
          label: "Spotify URL",
        }),
        amazonUrl: fields.url({
          label: "Amazon Music URL",
        }),
        keywords: fields.text({
          label: "SEO Keywords",
          description: "Comma-separated keywords specific to this episode",
        }),
        frameworks: fields.text({
          label: "Frameworks Discussed",
          description: "Comma-separated framework names mentioned in this episode",
        }),
        showNotes: fields.document({
          label: "Show Notes",
          description: "Full show notes with timestamps, key takeaways, and links",
          formatting: true,
          dividers: true,
          links: true,
        }),
        transcript: fields.document({
          label: "Full Transcript",
          description: "Paste or upload the full episode transcript",
          formatting: true,
          links: true,
        }),
      },
    }),
    articles: collection({
      label: "Articles",
      slugField: "title",
      path: "content/articles/*",
      format: { data: "json" },
      schema: {
        title: fields.slug({
          name: { label: "Article Title", validation: { isRequired: true } },
        }),
        publishDate: fields.date({
          label: "Publish Date",
          validation: { isRequired: true },
        }),
        author: fields.text({
          label: "Author",
          defaultValue: "Vernon Ross",
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: "Short Description (for cards & meta)",
          multiline: true,
          validation: { isRequired: true },
        }),
        category: fields.text({
          label: "Category",
          description: "e.g. 'AEO-GEO Strategy', 'Leadership', 'AI Implementation'",
        }),
        tags: fields.text({
          label: "Tags",
          description: "Comma-separated tags",
        }),
        keywords: fields.text({
          label: "SEO Keywords",
          description: "Comma-separated keywords for search and AI discoverability",
        }),
        featuredImage: fields.image({
          label: "Featured Image",
          directory: "public/images/articles",
          publicPath: "/images/articles",
          description: "Optional featured image. Falls back to STL default cover.",
        }),
        seoTitle: fields.text({
          label: "SEO Title",
          description: "Optional — only if different from the article title",
        }),
        canonicalUrl: fields.url({
          label: "Canonical URL",
          description: "Only needed if syndicating to another platform",
        }),
        body: fields.document({
          label: "Article Body",
          description: "Full article content",
          formatting: true,
          dividers: true,
          links: true,
          tables: true,
        }),
      },
    }),
  },
});
