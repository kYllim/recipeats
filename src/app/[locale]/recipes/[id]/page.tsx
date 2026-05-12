import { notFound } from "next/navigation";
import { Ingredient, Comment } from "@prisma/client";

export const dynamic = "force-dynamic";
import { getDictionary } from "@/i18n";
import { hasLocale, Locale } from "@/proxy";
import { prisma } from "@/lib/prisma";
import { CommentList } from "@/components/CommentList"; 
import { FavoriteButton } from "@/components/FavoriteButton";
import { StarRating } from "@/components/StarRating";
import type { Metadata } from "next";
import Image from "next/image";

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
  params: Promise<{ locale: Locale; id: string }>;
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
    <div className="flex flex-col gap-0 pb-20">
      {/* Visual Header */}
      <div className="relative h-[50vh] min-h-[400px] w-full bg-zinc-900">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20">🍲</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-5xl mx-auto w-full px-4 pb-12">
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-[0.2em] bg-amber-500 text-zinc-950 px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20">
                  {difficultyLabel}
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em] bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full">
                  ⏱ {recipe.prepTime} {t.recipes.minutes}
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                  <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter">
                    {recipe.title}
                  </h1>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-3">
                      <StarRating value={avgRating} readonly size="sm" />
                      <span className="text-sm font-bold text-zinc-500">
                        {recipe.comments.length} {t.recipes.commentsCount}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <FavoriteButton
                    recipeId={recipe.id}
                    recipeTitle={recipe.title}
                    t={t.favorites}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-5xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        {/* Left Column: Description & Instructions */}
        <div className="lg:col-span-8 flex flex-col gap-12">
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500 rounded-full" />
              Description
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed italic border-l-4 border-zinc-100 dark:border-zinc-800 pl-6 py-2">
              {recipe.description}
            </p>
          </section>

          <section className="flex flex-col gap-8">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
              <span className="w-8 h-1 bg-amber-500 rounded-full" />
              {t.recipes.instructions}
            </h2>
            <ol className="flex flex-col gap-8">
              {steps.map((step: string, i: number) => (
                <li key={i} className="group flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="flex w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-black flex items-center justify-center text-lg group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 pt-1.5">
                    <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed">
                      {step.replace(/^\d+\.\s*/, "")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <hr className="border-zinc-100 dark:border-zinc-800" />
          
          <CommentList recipeId={recipe.id} locale={locale} t={t.comments} />
        </div>

        {/* Right Column: Ingredients (Sidebar-style on desktop) */}
        <aside className="lg:col-span-4 flex flex-col gap-8">
          <div className="sticky top-28 p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              {t.recipes.ingredients}
            </h2>
            <ul className="flex flex-col gap-4">
              {recipe.ingredients.map((ing: Ingredient) => (
                <li
                  key={ing.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-bold text-zinc-700 dark:text-zinc-200">{ing.name}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-black">
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
