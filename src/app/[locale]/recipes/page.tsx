import Link from "next/link";
import { notFound } from "next/navigation";
import { Recipe } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n";
import { FavoriteButton } from "@/components/FavoriteButton";

export const dynamic = "force-dynamic";
import { hasLocale } from "@/proxy";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.nav.recipes,
    description: t.meta.homeDescription,
  };
}

export default async function RecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);
  
  let recipes: (Recipe & { _count: { comments: number } })[] = [];
  let dbError = false;

  try {
    recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { comments: true } } },
    });
  } catch (err) {
    console.error("[RecipesPage] Database error:", err);
    dbError = true;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {t.nav.recipes}
        </h1>
        {!dbError && (
          <p className="text-zinc-500 dark:text-zinc-400">
            {recipes.length} {t.recipes.minutes}
          </p>
        )}
      </div>

      {dbError ? (
        <div className="py-24 text-center border-2 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 rounded-3xl">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            Impossible de se connecter à la base de données.
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
            Vérifiez votre variable DATABASE_URL dans le fichier .env
          </p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-zinc-500">Aucune recette trouvée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe: Recipe & { _count: { comments: number } }, i: number) => (
            <div
              key={recipe.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:shadow-xl hover:-translate-y-1 animate-card-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <FavoriteButton 
                recipeId={recipe.id} 
                recipeTitle={recipe.title} 
                t={t.favorites} 
                minimal={true} 
              />

              <Link
                href={`/${locale}/recipes/${recipe.id}`}
                className="flex flex-col h-full"
              >
                <div className="aspect-[4/3] bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-4xl overflow-hidden">
                  {recipe.image ? (
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    "🍲"
                  )}
                </div>
              
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    {recipe.difficulty === 'easy' ? t.recipes.easy : recipe.difficulty === 'hard' ? t.recipes.hard : t.recipes.medium}
                  </span>
                  <span className="text-xs text-zinc-400">
                    ⏱ {recipe.prepTime} min
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">
                  {recipe.title}
                </h2>
                
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>
                
                <div className="mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-medium text-zinc-400">
                  <span>{recipe._count.comments} commentaires</span>
                  <span className="text-amber-500 group-hover:translate-x-1 transition-transform">Voir →</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
