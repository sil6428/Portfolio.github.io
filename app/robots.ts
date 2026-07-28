import type { MetadataRoute } from "next";

const baseUrl = "https://affan-shaikh-portfolio.sil6428-archtech.workers.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
