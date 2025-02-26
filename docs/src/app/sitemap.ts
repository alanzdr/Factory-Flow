import type { MetadataRoute } from "next";
import { getLanguages } from "@/data/docs";

const BASE_URL = process.env.siteUrl;
const BUILD_TIME = process.env.buildTime;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [];

  const addPage = (path: string) => {
    let sanitizedPath = path.endsWith("/") ? path : `${path}/`;
    sanitizedPath = sanitizedPath.startsWith("/")
      ? sanitizedPath
      : `/${sanitizedPath}`;

    const url = `${BASE_URL}${sanitizedPath}`;

    pages.push({
      url,
      lastModified: BUILD_TIME,
    });
  };

  // Home
  addPage("/");

  // Docs
  const versions = getLanguages();

  for (const version of versions) {
    addPage(`/docs/${version.slug}`);
    for (const category of version.categories) {
      for (const page of category.pages) {
        const slug = page.slug;

        if (slug) {
          addPage(`/docs/${version.slug}/${category.slug}/${page.slug}`);
        }
      }
    }
  }

  return pages;
}
