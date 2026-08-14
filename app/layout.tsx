import type { Metadata } from "next";
import { headers } from "next/headers";
import SiteExtras from "./site-extras";
import TopologyScene from "./topology-scene";
import "./globals.css";

const publicUrl = "https://affan-shaikh-portfolio.sil6428-archtech.workers.dev";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Affan Shaikh | Networking & Cybersecurity",
    description:
      "Portfolio of Affan Shaikh, a networking and cybersecurity student building secure systems and useful software.",
    icons: { icon: "/lab-favicon.svg", shortcut: "/lab-favicon.svg" },
    openGraph: {
      title: "Affan Shaikh | Networking & Cybersecurity",
      description: "Networks, security, and software built with purpose.",
      type: "website",
      url: origin,
      images: [{ url: "/og-cutaway-v3.png", width: 1731, height: 909, alt: "Affan Shaikh warm cutaway studio portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Affan Shaikh | Networking & Cybersecurity",
      description: "Networks, security, and software built with purpose.",
      images: ["/og-cutaway-v3.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${publicUrl}/#website`,
        url: publicUrl,
        name: "Affan Shaikh",
        description: "Networking, cybersecurity, and the things I build.",
      },
      {
        "@type": "ProfilePage",
        "@id": `${publicUrl}/#profile`,
        url: publicUrl,
        name: "Affan Shaikh | Networking & Cybersecurity",
        mainEntity: {
          "@type": "Person",
          name: "Affan Shaikh",
          url: publicUrl,
          sameAs: [
            "https://github.com/sil6428",
            "https://www.linkedin.com/in/sil6428",
            "https://sy1len.vsco.site",
          ],
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "Ontario Tech University",
          },
          knowsAbout: [
            "Cybersecurity",
            "Computer networking",
            "Cisco IOS",
            "Python",
            "TypeScript",
            "Cloudflare Workers",
          ],
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <TopologyScene />
        {children}
        <SiteExtras />
      </body>
    </html>
  );
}
