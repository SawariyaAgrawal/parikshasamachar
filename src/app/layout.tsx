import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Lora } from "next/font/google";
import "@fontsource/manufacturing-consent/400.css";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora"
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://parikshasamachar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pariksha Samachar — India's Premier Exam Notification Platform | JEE, NEET, SAT",
    template: "%s | Pariksha Samachar"
  },
  description:
    "Free exam notification platform for JEE, NEET, SAT aspirants. Get timely updates, join exam communities, and never miss a deadline. India's most trusted exam notification source.",
  keywords: [
    "exam notifications",
    "JEE updates",
    "NEET notifications",
    "SAT exam",
    "exam preparation",
    "India exams",
    "government exam notifications",
    "exam community",
    "Pariksha Samachar"
  ],
  authors: [{ name: "Pariksha Samachar", url: siteUrl }],
  creator: "Pariksha Samachar",
  publisher: "Pariksha Samachar",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Pariksha Samachar",
    title: "Pariksha Samachar — Exam Notifications for JEE, NEET, SAT",
    description: "India's premier exam notification platform. Free updates for JEE, NEET, SAT and more. Join exam communities.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Pariksha Samachar" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pariksha Samachar — Exam Notifications",
    description: "India's premier exam notification platform. Free for JEE, NEET, SAT aspirants.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  alternates: {
    canonical: siteUrl
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: ["/logo.png"],
    apple: [{ url: "/logo.png", type: "image/png" }]
  },
  category: "education",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1f275d",
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pariksha Samachar",
    url: siteUrl,
    description: "India's premier exam notification platform for JEE, NEET, SAT aspirants",
    publisher: {
      "@type": "Organization",
      name: "Pariksha Samachar",
      url: siteUrl
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/community`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <body className={lora.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
