"use client";

import { useCallback } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/contexts/ToastContext";
import type { Dictionary } from "@/i18n";

interface FavoriteButtonProps {
  recipeId: string;
  recipeTitle: string;
  t: Dictionary["favorites"];
  minimal?: boolean;
}

export function FavoriteButton({ recipeId, recipeTitle, t, minimal }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();

  const active = isFavorite(recipeId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipeId);
    showToast(
      active ? t.removed : t.added,
      active ? "info" : "success"
    );
  };

  if (minimal) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={[
          "absolute top-4 right-4 z-10 w-11 h-11 rounded-2xl flex items-center justify-center transition-all group",
          "backdrop-blur-xl shadow-xl",
          active 
            ? "bg-rose-500 text-white shadow-rose-500/30 scale-110" 
            : "bg-white/70 dark:bg-zinc-900/70 text-zinc-400 hover:text-rose-500 border border-white/20 dark:border-zinc-800/50 hover:scale-110"
        ].join(" ")}
      >
        <svg 
          className={[
            "w-6 h-6 transition-transform duration-300",
            active ? "fill-current scale-110" : "fill-none group-hover:scale-110"
          ].join(" ")} 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      id={`favorite-btn-${recipeId}`}
      type="button"
      onClick={handleClick}
      aria-label={active ? `Retirer ${recipeTitle} des favoris` : `Ajouter ${recipeTitle} aux favoris`}
      aria-pressed={active}
      className={[
        "group flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-black transition-all active:scale-95",
        active
          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
          : "bg-white dark:bg-zinc-900 text-rose-500 border-2 border-rose-100 dark:border-rose-900/30 hover:border-rose-500"
      ].join(" ")}
    >
      <svg 
        className={[
          "w-5 h-5 transition-transform duration-300",
          active ? "fill-current scale-110" : "fill-none group-hover:scale-110"
        ].join(" ")} 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {active ? "Ajouté" : "Favoris"}
    </button>
  );
}
