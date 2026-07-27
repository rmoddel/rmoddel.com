import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: "https://rmoddel.com",
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: "https://rmoddel.com/work",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: "https://rmoddel.com/chat",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: "https://rmoddel.com/experience",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: "https://rmoddel.com/about",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://rmoddel.com/contact",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://rmoddel.com/resume",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: "https://rmoddel.com/resume.pdf",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: "https://rmoddel.com/resume-product.pdf",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: "https://rmoddel.com/resume-customer-success.pdf",
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: "https://rmoddel.com/privacy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4
    }
  ];
}
