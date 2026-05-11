"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "recipeats_favorites";

interface FavoritesContextValue {
  favorites: Set<string>;
  addFavorite: (recipeId: string) => void;
  removeFavorite: (recipeId: string) => void;
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(new Set(JSON.parse(stored) as string[]));
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = useCallback((next: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      // ignore
    }
  }, []);

  const addFavorite = useCallback(
    (recipeId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev).add(recipeId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const removeFavorite = useCallback(
    (recipeId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(recipeId);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const toggleFavorite = useCallback(
    (recipeId: string) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(recipeId)) {
          next.delete(recipeId);
        } else {
          next.add(recipeId);
        }
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const isFavorite = useCallback(
    (recipeId: string) => favorites.has(recipeId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
