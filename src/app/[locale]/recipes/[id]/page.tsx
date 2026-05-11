import { notFound } from "next/navigation";
import { Ingredient, Comment } from "@prisma/client";

export const dynamic = "force-dynamic";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/proxy";
import { prisma } from "@/lib/prisma";
import { CommentList } from "@/components/CommentList"; 
import { FavoriteButton } from "@/components/FavoriteButton";
import { StarRating } from "@/components/StarRating";
import type { Metadata } from "next";

async function getRecipe(id: string) {
  return prisma.recipe.findUnique({
    where: { id },
    include: { ingredients: true, comments: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  const id = resolvedParams?.id;
  if (!locale || !id || !hasLocale(locale)) return {};
  const t = getDictionary(locale);
  const recipe = await getRecipe(id);
  if (!recipe) return { title: t.meta["404Title"] };
  return {
    title: `${recipe.title} | RecipEats`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      images: recipe.image ? [recipe.image] : [],
    },
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  const id = resolvedParams?.id;
  if (!locale || !id || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);
  
  let recipe = null;
  let dbError = false;

  try {
    recipe = await getRecipe(id);
  } catch (err) {
    console.error("[RecipeDetailPage] Database error:", err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="p-12 border-2 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 rounded-3xl">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            Erreur de connexion à la base de données.
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
            Impossible de charger la recette.
          </p>
        </div>
      </div>
    );
  }

  if (!recipe) notFound();

  const avgRating =
    recipe.comments.length > 0
      ? Math.round(
          recipe.comments.reduce((sum: number, c: Comment) => sum + c.rating, 0) /
            recipe.comments.length
        )
      : 0;

  const difficultyLabel =
    recipe.difficulty === "easy"
      ? t.recipes.easy
      : recipe.difficulty === "hard"
        ? t.recipes.hard
        : t.recipes.medium;

  const steps = recipe.instructions
    .split(/\n/)
    .map((s: string) => s.trim())
    .filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 px-3 py-1 rounded-full">
                {difficultyLabel}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 px-3 py-1 rounded-full">
                ⏱ {recipe.prepTime} {t.recipes.minutes}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {recipe.title}
            </h1>
            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <StarRating value={avgRating} readonly size="sm" />
                <span className="text-sm text-zinc-500">
                  ({recipe.comments.length})
                </span>
              </div>
            )}
          </div>
          <FavoriteButton
            recipeId={recipe.id}
            recipeTitle={recipe.title}
            t={t.favorites}
          />
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
          {recipe.description}
        </p>
      </div>

      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          🥕 {t.recipes.ingredients}
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recipe.ingredients.map((ing: Ingredient) => (
            <li
              key={ing.id}
              className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="font-medium">{ing.name}</span>
              <span className="text-zinc-400 ml-auto">
                {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          📋 {t.recipes.instructions}
        </h2>
        <ol className="flex flex-col gap-4">
          {steps.map((step: string, i: number) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed pt-1">
                {step.replace(/^\d+\.\s*/, "")}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <CommentList recipeId={recipe.id} locale={locale} t={t.comments} />
    </div>
  );
}
