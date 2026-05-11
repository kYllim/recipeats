"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getRecipesByIds } from "@/actions/recipes";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/proxy";

interface RecipeData {
  id: string;
  title: string;
  image: string | null;
  difficulty: string;
  prepTime: number;
}

interface FavoritesClientProps {
  locale: Locale;
  t: Dictionary["favorites"];
  navT: Dictionary["recipes"];
}

export function FavoritesClient({ locale, t, navT }: FavoritesClientProps) {
  const { favorites, removeFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchDetails = async () => {
      if (favorites.size === 0) {
        setRecipes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await getRecipesByIds([...favorites]);
      setRecipes(data as RecipeData[]);
      setLoading(false);
    };

    fetchDetails();
  }, [favorites, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (favorites.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-fade-in">
        <div className="relative">
          <span className="text-8xl" aria-hidden>💖</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full animate-ping" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            {t.empty}
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            Explorez nos recettes et cliquez sur le cœur pour les retrouver ici !
          </p>
        </div>
        <Link
          id="favorites-discover"
          href={`/${locale}/recipes`}
          className="rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold px-10 py-4 transition-all shadow-xl shadow-amber-200 dark:shadow-amber-900/20"
        >
          {t.emptyAction}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <span className="text-amber-600 dark:text-amber-400 font-bold">{favorites.size}</span> recette{favorites.size > 1 ? "s" : ""} sauvegardée{favorites.size > 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, i) => (
            <li
              key={recipe.id}
              className="group relative animate-card-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Link
                href={`/${locale}/recipes/${recipe.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-300 dark:hover:border-amber-900 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-amber-50 dark:bg-amber-900/20">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍲</div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    {recipe.difficulty === 'easy' ? navT.easy : recipe.difficulty === 'hard' ? navT.hard : navT.medium}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 truncate group-hover:text-amber-500 transition-colors">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>⏱ {recipe.prepTime} {navT.minutes}</span>
                  </div>
                </div>

                <div className="text-amber-500 group-hover:translate-x-1 transition-transform pr-2">
                  →
                </div>
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeFavorite(recipe.id);
                }}
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-rose-500 hover:scale-110 transition-transform z-10"
                title="Retirer des favoris"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
