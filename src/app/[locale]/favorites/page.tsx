import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/proxy";
import { FavoritesClient } from "@/components/FavoritesClient";
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
    title: t.meta.favoritesTitle,
    description: t.meta.favoritesDescription,
  };
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          ❤️ {t.favorites.title}
        </h1>
      </div>
      <FavoritesClient locale={locale} t={t.favorites} navT={t.recipes} />
    </div>
  );
}
