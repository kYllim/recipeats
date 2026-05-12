import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-6">
      <div className="relative select-none">
        <p className="text-[10rem] font-black text-zinc-100 dark:text-zinc-800 leading-none">
          404
        </p>
        <span className="absolute inset-0 flex items-center justify-center text-7xl animate-bounce-slow">
          🥣
        </span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        {err.title}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
        {err.description}
      </p>
      <Link
        id="not-found-back"
        href={`/${locale}`}
        className="rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-semibold px-8 py-3 transition-all shadow-md"
      >
        {err.action}
      </Link>
    </div>
  );
}
