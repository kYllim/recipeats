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
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center gap-10">
      <div className="relative select-none">
        <p className="text-[12rem] md:text-[20rem] font-black text-zinc-100 dark:text-zinc-900 leading-none tracking-tighter">
          500
        </p>
        <span className="absolute inset-0 flex items-center justify-center text-8xl md:text-9xl animate-spin-slow">
          🔥
        </span>
      </div>
      
      <div className="flex flex-col gap-4 relative z-10 -mt-10 md:-mt-20">
        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          Erreur serveur / Server Error
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-lg">
          Quelque chose s&apos;est mal passé de notre côté.
          <br />
          Something went wrong on our end.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          id="error-retry"
          type="button"
          onClick={reset}
          className="rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-black px-10 py-5 transition-all shadow-xl shadow-amber-500/20"
        >
          Réessayer / Try again
        </button>
        <Link
          id="error-home"
          href="/"
          className="rounded-full border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-black px-10 py-5 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Accueil / Home
        </Link>
      </div>
    </div>
  );
}
