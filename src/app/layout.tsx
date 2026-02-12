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
    "Leaders reveal the frameworks behind the moments that changed everything. A podcast with strategic storytelling frameworks, AI implementation strategies, and real-world leadership insights. Hosted by Vernon Ross.",
  keywords: [
    "leadership podcast",
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
      "Leaders reveal the frameworks behind the moments that changed everything. Strategic storytelling and AI implementation for leaders who think differently.",
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
      "Leaders reveal the frameworks behind the moments that changed everything. Hosted by Vernon Ross.",
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
      </body>
    </html>
  );
}
