import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n";
import RecipeList from "@/components/recipes/RecipeList";
import Search from "@/components/recipes/Search";
import { Suspense } from 'react';
export const dynamic = "force-dynamic";
import { hasLocale } from "@/proxy";
import type { Metadata } from "next";
import z from "zod";
import type { Locale } from "@/proxy";

const SearchParamsSchema = z.object({
  query: z.string().optional().default(''),
  page: z.coerce.number().int().positive().optional().default(1),
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}
) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);

  const rawSearchParams = await searchParams;
  const validatedSearch = SearchParamsSchema.parse(rawSearchParams);
  const query = validatedSearch.query;
  const currentPage = validatedSearch.page;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {t.nav.recipes}
        </h1>
      </div>
      <Search placeholder={ t.recipes.search } />
      <Suspense key={query + currentPage} fallback={
        <div className="py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-zinc-500">{ t.recipes.loading }</p>
        </div>
      }>
        <RecipeList 
          locale={locale}
          query={query}
        />
      </Suspense>
      
    </div>
  );
}
