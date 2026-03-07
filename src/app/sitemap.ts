import { MetadataRoute } from "next";
import { EXAMS } from "@/lib/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://parikshasamachar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const examPages = EXAMS.map((exam) => ({
    url: `${baseUrl}/community/${exam.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const notificationPages = EXAMS.map((exam) => ({
    url: `${baseUrl}/notifications/${exam.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    ...examPages,
    ...notificationPages
  ];
}
