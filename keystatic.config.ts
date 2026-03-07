import { config, fields, collection } from "@keystatic/core";

// Use GitHub mode only when the env vars are actually present.
// This avoids the chicken-and-egg: Keystatic needs env vars to run in
// GitHub mode, but the setup wizard that creates those vars needs the
// API route working. Falls back to local mode during setup.
const useGitHub = !!(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
  process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
  process.env.KEYSTATIC_SECRET
);

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
  },
});
