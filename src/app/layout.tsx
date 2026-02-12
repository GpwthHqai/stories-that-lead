import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
  title: "Stories That Lead — Not Conflict. Revelation. | Vernon Ross",
  description:
    "A podcast for communications leaders navigating AI disruption. Enterprise storytelling frameworks that drive understanding, not drama. Hosted by Vernon Ross.",
  keywords: [
    "enterprise podcast",
    "internal communications",
    "AI communications",
    "corporate storytelling",
    "Vernon Ross",
    "Stories That Lead",
    "communications leadership",
    "podcast for leaders",
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
      "A podcast for communications leaders navigating AI disruption. Enterprise storytelling frameworks that drive understanding, not drama.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 1200,
        alt: "Stories That Lead Podcast with Vernon Ross",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories That Lead — Not Conflict. Revelation.",
    description:
      "A podcast for communications leaders navigating AI disruption. Hosted by Vernon Ross.",
    images: ["/images/og-image.jpg"],
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
              description:
                "A podcast for communications leaders navigating AI disruption. Enterprise storytelling frameworks that drive understanding, not drama.",
              author: {
                "@type": "Person",
                name: "Vernon Ross",
                jobTitle: "Enterprise Podcaster & Communications Consultant",
                url: "https://vernonross.com",
              },
              genre: [
                "Business",
                "Communications",
                "Leadership",
                "Technology",
              ],
              inLanguage: "en",
              image: "/images/og-image.jpg",
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
              jobTitle: "Enterprise Podcaster & Communications Consultant",
              description:
                "Vernon Ross helps Fortune 500 communications teams integrate AI into their workflows through strategic podcast consulting and proprietary frameworks.",
              knowsAbout: [
                "Enterprise Communications",
                "Internal Podcasting",
                "AI in Communications",
                "Corporate Storytelling",
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
      </body>
    </html>
  );
}
