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
    <div className="flex flex-col gap-12 pb-20">
      {/* Header with Search */}
      <header className="relative bg-zinc-900 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900" />
           <img 
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop" 
            alt="Recipes Header" 
            className="w-full h-full object-cover"
           />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              {t.nav.recipes}
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl">
              {t.home.subtitle}
            </p>
          </div>
          
          <div className="max-w-2xl">
            <Search placeholder={ t.recipes.search } />
          </div>
        </div>
      </header>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-4 w-full">
        <Suspense key={query + currentPage} fallback={
          <div className="py-32 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-500 font-medium">{ t.recipes.loading }</p>
          </div>
        }>
          <RecipeList 
            locale={locale}
            query={query}
          />
        </Suspense>
      </main>
    </div>
  );
}
