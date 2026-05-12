import Link from "next/link";
import { getDictionary } from "@/i18n";
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
    title: t.meta["404Title"],
    description: t.errors["404"].description,
  };
}

export default async function NotFoundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "fr"; // Fallback to fr
  const t = getDictionary(locale as any);
  const err = t.errors["404"];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center gap-10">
      <div className="relative select-none">
        <p className="text-[12rem] md:text-[20rem] font-black text-zinc-100 dark:text-zinc-900 leading-none tracking-tighter">
          404
        </p>
        <span className="absolute inset-0 flex items-center justify-center text-8xl md:text-9xl animate-bounce-slow">
          🥣
        </span>
      </div>
      
      <div className="flex flex-col gap-4 relative z-10 -mt-10 md:-mt-20">
        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          {err.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-lg">
          {err.description}
        </p>
      </div>

      <Link
        id="not-found-back"
        href={`/${locale}`}
        className="rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-black px-10 py-5 transition-all shadow-xl shadow-amber-500/20"
      >
        {err.action}
      </Link>
    </div>
  );
}
