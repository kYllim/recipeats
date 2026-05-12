import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import RecipeList from "@/components/recipes/RecipeList";

export const dynamic = "force-dynamic";
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
    title: t.nav.recipes,
    description: t.meta.homeDescription,
  };
}

export default async function RecipesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {t.nav.recipes}
        </h1>
      </div>
        <RecipeList 
          locale={locale}        
        />
    </div>
  );
}
