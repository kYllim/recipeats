import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/proxy";

const BASE_URL = "https://recipeats.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/${locale}/recipes`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/${locale}/favorites`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ]);

  // Dynamic recipe pages
  let recipePages: MetadataRoute.Sitemap = [];
  /*
  if (process.env.DATABASE_URL) {
    try {
      const recipes = await prisma.recipe.findMany({
        select: { id: true, createdAt: true },
      });

      recipePages = locales.flatMap((locale) =>
        recipes.map((recipe) => ({
          url: `${BASE_URL}/${locale}/recipes/${recipe.id}`,
          lastModified: recipe.createdAt,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      );
    } catch {
      // DB not available during build — return static pages only
    }
  }
  */

  return [...staticPages, ...recipePages];
}
