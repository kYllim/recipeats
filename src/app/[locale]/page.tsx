import Link from "next/link";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/proxy";
import { notFound } from "next/navigation";
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
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col gap-6">
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            {t.home.hero}
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t.home.subtitle}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              href={`/${locale}/recipes`}
              className="rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold px-8 py-4 transition-all shadow-xl shadow-amber-200 dark:shadow-none"
            >
              {t.home.cta}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
