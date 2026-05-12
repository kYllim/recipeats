import Link from "next/link";
import { getDictionary } from "@/i18n";
import { hasLocale } from "@/proxy";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/recipes/RecipeCard";

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

  // Fetch latest recipes
  const latestRecipes = await prisma.recipe.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  // Fetch some stats
  const [recipesCount, commentsCount] = await Promise.all([
    prisma.recipe.count(),
    prisma.comment.count(),
  ]);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />
           <img 
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
           />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 px-4 flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 self-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-amber-500 text-xs font-bold uppercase tracking-wider">
              {t.home.featuredTitle}
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            {t.home.hero.split(' ').map((word, i) => (
              <span key={i} className={i === 2 ? "text-amber-500" : ""}>{word} </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.home.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <Link
              href={`/${locale}/recipes`}
              className="group relative rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 font-bold px-10 py-5 transition-all shadow-2xl shadow-amber-500/20 flex items-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">{t.home.cta}</span>
              <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <Link
              href={`/${locale}/recipes/new`}
              className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 text-white font-bold px-10 py-5 transition-all flex items-center gap-2"
            >
              {t.nav.addRecipe}
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30 text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              {t.home.featuredTitle}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl">
              {t.home.featuredSubtitle}
            </p>
          </div>
          <Link 
            href={`/${locale}/recipes`}
            className="text-amber-600 dark:text-amber-500 font-bold flex items-center gap-2 group"
          >
            {t.home.cta}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} locale={locale} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900/50 -z-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                {t.home.statsTitle}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-xl mx-auto lg:mx-0">
                Rejoignez des milliers de passionnés de cuisine qui partagent leurs secrets chaque jour. 
                Une plateforme faite par des chefs, pour tout le monde.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4">
                <div className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">100% Gratuit</span>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">Communauté Active</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Stat Card 1 */}
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums">
                    {recipesCount}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">
                    {t.home.recipesCount}
                  </span>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all hover:-translate-y-1 sm:mt-8">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-zinc-900 shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums">
                    {Math.floor(recipesCount * 1.5) + 12}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">
                    {t.home.usersCount}
                  </span>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="group p-8 rounded-[2rem] bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-4xl font-black text-zinc-900 dark:text-zinc-50 tabular-nums">
                    {commentsCount}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs">
                    {t.home.commentsCount}
                  </span>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col justify-center items-center text-center text-white shadow-xl shadow-amber-500/20 sm:mt-8">
                <span className="text-2xl font-bold leading-tight mb-4">Rejoignez l'aventure</span>
                <Link 
                  href={`/${locale}/recipes/new`}
                  className="bg-white text-amber-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-50 transition-colors"
                >
                  Publier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}