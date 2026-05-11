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
    title: t.nav.addRecipe,
  };
}

export default async function AddRecipePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          ➕ {t.nav.addRecipe}
        </h1>
        <div className="p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center bg-white dark:bg-zinc-900 shadow-sm">
          <p className="text-zinc-500 mb-4">
            Cette fonctionnalité est en cours de développement.
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}
