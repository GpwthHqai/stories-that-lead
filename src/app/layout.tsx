import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.storiesthatlead.co"),
  alternates: {
    canonical: "/",
  },
  title: "Stories That Lead — Not Conflict. Revelation. | Vernon Ross",
  description:
    "A leadership communication podcast where leaders reveal the frameworks behind the moments that changed everything. Strategic storytelling frameworks, AI implementation strategies, and executive communication frameworks for senior leaders. Hosted by Vernon Ross.",
  keywords: [
    "leadership podcast",
    "leadership communication podcast",
    "enterprise podcast",
    "storytelling frameworks",
    "AI implementation",
    "leadership storytelling",
    "Vernon Ross",
    "Stories That Lead",
    "Micro-Arc Framework",
    "Kishōtenketsu",
    "corporate storytelling",
    "leadership frameworks",
    "AI for leaders",
    "communications leadership",
    "executive communication frameworks",
    "how leaders tell transformation stories",
    "podcast for senior leaders",
    "strategic storytelling for executives",
    "AI leadership transformation",
  ],
  authors: [{ name: "Vernon Ross" }],
  creator: "Vernon Ross",
  publisher: "Vernon Ross",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Stories That Lead",
    title: "Stories That Lead — Not Conflict. Revelation.",
    description:
      "A leadership communication podcast where leaders reveal the frameworks behind the moments that changed everything. Strategic storytelling and AI implementation for leaders who think differently.",
    images: [
      {
        url: "/images/og-image-wide.jpg",
        width: 1200,
        height: 630,
        alt: "Stories That Lead Podcast with Vernon Ross",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories That Lead — Not Conflict. Revelation.",
    description:
      "A leadership communication podcast where leaders reveal the frameworks behind the moments that changed everything. Hosted by Vernon Ross.",
    images: ["/images/og-image-wide.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PodcastSeries",
              name: "Stories That Lead",
              url: "https://www.storiesthatlead.co",
              description:
                "Leaders reveal the frameworks behind the moments that changed everything. Strategic storytelling and AI implementation insights structured how leaders actually think.",
              author: {
                "@type": "Person",
                name: "Vernon Ross",
                jobTitle: "Enterprise Podcaster & Leadership Storytelling Consultant",
                url: "https://vernonross.com",
              },
              genre: [
                "Business",
                "Leadership",
                "Storytelling",
                "Technology",
                "Communications",
              ],
              inLanguage: "en",
              image: "https://www.storiesthatlead.co/images/og-image.jpg",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Vernon Ross",
              jobTitle: "Enterprise Podcaster & Leadership Storytelling Consultant",
              description:
                "Vernon Ross helps leaders tell the stories that drive transformation. Creator of the Micro-Arc Framework and Voice Note Blueprint — proprietary methodologies that structure narrative around revelation instead of conflict.",
              knowsAbout: [
                "Leadership Storytelling",
                "Enterprise Communications",
                "AI Implementation",
                "Podcast Production",
                "The Micro-Arc Framework",
                "Kishōtenketsu",
              ],
            }),
          }}
        />
        {/* AI crawlers */}
        <meta name="robots" content="index, follow" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
        <Analytics />
        <GoogleAnalytics gaId="G-W0F1BLD4RM" />
      </body>
    </html>
  );
}
