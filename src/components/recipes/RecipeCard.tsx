import Image from 'next/image';
import Link from 'next/link'
import { FavoriteButton } from "@/components/FavoriteButton";
import { getDictionary } from "@/i18n/index";
import type { Locale } from "@/proxy";
import { Recipe } from "@prisma/client";

interface RecipeCardProps {
  recipe: Recipe & {
    _count?: {
      comments: number;
    };
  };
  locale: Locale;
  delay?: number;
}

export default async function RecipeCard({
  recipe,
  locale,
  delay = 200
}: RecipeCardProps){
  const t = await getDictionary(locale);
  return (
            <div
              key={recipe.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:shadow-xl hover:-translate-y-1 animate-card-in"
              style={{ animationDelay: `${delay}ms` }}
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
                <div className="relative aspect-[4/3] bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-4xl overflow-hidden">
                  {recipe.coverImage ? (
                    <Image 
                      src={recipe.coverImage || "/recipes/placeholder-recipe.png"} 
                      alt={recipe.title} 
                      fill
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
                  <span>{recipe._count?.comments || 0} {t.recipes.commentsCount}
                    </span>
                  <span className="text-amber-500 group-hover:translate-x-1 transition-transform">{t.recipes.viewDetails} →</span>
                </div>
              </div>
            </Link>
        </div>
  );
}