import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getDictionary } from "@/i18n";
import { hasLocale } from "@/proxy";
import { RecipeForm } from "@/components/RecipeForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locale || !hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.addRecipe.title,
    description: t.addRecipe.subtitle,
  };
}

export default async function NewRecipePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locale || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Header */}
      <header className="relative bg-zinc-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900" />
           <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop" 
            alt="New Recipe Header" 
            className="w-full h-full object-cover"
           />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col gap-4">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            🧑‍🍳 {t.addRecipe.title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            {t.addRecipe.subtitle}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 w-full">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <RecipeForm locale={locale} t={t.addRecipe} />
        </div>
      </main>
    </div>
  );
}
