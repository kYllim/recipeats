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
    <div className="flex flex-col gap-12 pb-20">
      {/* Header */}
      <header className="relative bg-zinc-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900" />
           <img 
            src="https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=2070&auto=format&fit=crop" 
            alt="Favorites Header" 
            className="w-full h-full object-cover"
           />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col gap-2">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight flex items-center gap-4">
            ❤️ {t.favorites.title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            {t.favorites.description || t.meta.favoritesDescription}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 w-full">
        <FavoritesClient locale={locale} t={t.favorites} navT={t.recipes} />
      </main>
    </div>
  );
}
