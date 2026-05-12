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
  if (!hasLocale(locale)) return {};
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
  if (!hasLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          🧑‍🍳 {t.addRecipe.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {t.addRecipe.subtitle}
        </p>
      </header>

      <RecipeForm locale={locale} t={t.addRecipe} />
    </div>
  );
}
