import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/proxy";

const BASE_URL = "https://recipeats.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Pages statiques 
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

  // 2. Récupérer les recettes depuis la base de données
  const recipes = await prisma.recipe.findMany({
    select: { id: true, createdAt: true },
  });

  // 3. Créer les URLs pour chaque recette dans chaque langue
  const recipePages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    recipes.map((recipe) => ({
      url: `${BASE_URL}/${locale}/recipes/${recipe.id}`,
      lastModified: recipe.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  );

  // On combine tout : statique + dynamique
  return [...staticPages, ...recipePages];
}
