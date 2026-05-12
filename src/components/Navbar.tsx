"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/proxy";

interface NavbarProps {
  locale: Locale;
  t: Dictionary["nav"];
}

export function Navbar({ locale, t }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { favorites } = useFavorites();
  const favCount = favorites.size;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    router.push(newPath);
  };

  const otherLocale: Locale = locale === "fr" ? "en" : "fr";

  const navLinks = [
    { href: `/${locale}`, label: t.home, icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: `/${locale}/recipes`, label: t.recipes, icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { href: `/${locale}/favorites`, label: t.favorites, icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )},
  ];

  const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
  const showGlass = scrolled || !isHomePage || isOpen;

  return (
    <header 
      style={{ "--header-height": showGlass ? "64px" : "80px" } as React.CSSProperties}
      className={[
        "sticky top-0 z-50 w-full transition-all duration-300",
        isOpen
          ? "bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 py-3"
          : showGlass 
            ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 py-3" 
            : "bg-transparent py-5"
      ].join(" ")}
    >
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2 text-2xl font-black tracking-tighter"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:rotate-12 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <span className={[
            "transition-colors",
            showGlass ? "text-zinc-900 dark:text-zinc-50" : "text-white"
          ].join(" ")}>
            Recip<span className="text-amber-500">Eats</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-2 bg-zinc-100/50 dark:bg-zinc-800/50 p-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive =
              link.href === `/${locale}`
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all",
                    isActive
                      ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-500 shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
                  ].join(" ")}
                >
                  {link.icon}
                  {link.label}
                  {link.href.includes("favorites") && favCount > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 rounded-full bg-rose-500 text-white text-[10px] font-black px-1">
                      {favCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => switchLocale(otherLocale)}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
              showGlass
                ? "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                : "border-white/20 text-white/80 hover:bg-white/10"
            ].join(" ")}
          >
            <span className="text-base">{otherLocale === "fr" ? "🇫🇷" : "🇬🇧"}</span>
            <span className="hidden sm:block uppercase tracking-widest">{otherLocale}</span>
          </button>

          <Link
            href={`/${locale}/recipes/new`}
            className="hidden sm:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-zinc-950 text-sm font-black px-6 py-2.5 rounded-full transition-all shadow-lg shadow-amber-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            {t.addRecipe}
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={[
              "md:hidden p-2 rounded-xl transition-colors",
              showGlass ? "text-zinc-900 dark:text-zinc-50" : "text-white"
            ].join(" ")}
          >
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[var(--header-height)] z-50 bg-white dark:bg-zinc-950 md:hidden flex flex-col border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex-1 bg-white dark:bg-zinc-950 flex flex-col p-6 gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 text-2xl font-black text-zinc-900 dark:text-zinc-50 hover:text-amber-500 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500">
                  {link.icon}
                </div>
                {link.label}
              </Link>
            ))}
            <hr className="border-zinc-100 dark:border-zinc-800" />
            <Link
              href={`/${locale}/recipes/new`}
              className="flex items-center justify-center gap-2 bg-amber-500 text-zinc-950 text-lg font-black p-5 rounded-[2rem] shadow-xl shadow-amber-500/20"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              {t.addRecipe}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
