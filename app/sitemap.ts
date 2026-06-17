import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://rmoddel.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://rmoddel.com/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4
    }
  ];
}
