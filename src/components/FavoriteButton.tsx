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
          "absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all",
          "backdrop-blur-md shadow-lg",
          active 
            ? "bg-rose-500 text-white" 
            : "bg-white/80 text-zinc-400 hover:text-rose-500 dark:bg-zinc-800/80"
        ].join(" ")}
      >
        <span className={active ? "animate-heart-pop" : ""}>{active ? "❤️" : "🤍"}</span>
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
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
        "border-2 transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400",
        active
          ? "border-rose-500 bg-rose-500 text-white shadow-rose-200"
          : "border-rose-300 bg-white text-rose-500 hover:bg-rose-50 dark:bg-zinc-900 dark:border-rose-500 dark:hover:bg-rose-950",
        "active:scale-90",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "text-lg transition-transform duration-200",
          active ? "scale-125" : "scale-100",
        ].join(" ")}
      >
        {active ? "❤️" : "🤍"}
      </span>
      {active ? "Retirer" : "Favoris"}
    </button>
  );
}
