"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-6">
      <div className="relative select-none">
        <p className="text-[10rem] font-black text-zinc-100 dark:text-zinc-800 leading-none">
          500
        </p>
        <span className="absolute inset-0 flex items-center justify-center text-7xl animate-spin-slow">
          🔥
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Erreur serveur / Server Error
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
        Quelque chose s&apos;est mal passé de notre côté.
        <br />
        Something went wrong on our end.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          id="error-retry"
          type="button"
          onClick={reset}
          className="rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold px-8 py-3 transition-all shadow-md"
        >
          Réessayer / Try again
        </button>
        <Link
          id="error-home"
          href="/"
          className="rounded-full border-2 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 font-semibold px-8 py-3 transition-all hover:border-amber-400 hover:text-amber-600"
        >
          Accueil / Home
        </Link>
      </div>
    </div>
  );
}
