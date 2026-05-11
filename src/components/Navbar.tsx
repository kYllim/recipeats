"use client";

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

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    router.push(newPath);
  };

  const otherLocale: Locale = locale === "fr" ? "en" : "fr";

  const navLinks = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/recipes`, label: t.recipes },
    { href: `/${locale}/favorites`, label: t.favorites },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="text-xl font-extrabold text-amber-500 tracking-tight hover:opacity-80 transition-opacity"
          id="nav-logo"
        >
          🍳 RecipEats
        </Link>

        <ul className="hidden sm:flex items-center gap-1">
          {navLinks.map((link: { href: string; label: string }) => {
            const isActive =
              link.href === `/${locale}`
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={[
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
                  ].join(" ")}
                >
                  {link.label}
                  {link.href.includes("favorites") && favCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold">
                      {favCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <button
            id="locale-switcher"
            onClick={() => switchLocale(otherLocale)}
            className="text-xs font-semibold uppercase border border-zinc-300 dark:border-zinc-600 rounded-full px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:border-amber-400 hover:text-amber-600 transition-colors"
            aria-label={`Switch to ${otherLocale === "fr" ? "Français" : "English"}`}
          >
            {otherLocale === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
          </button>

          <Link
            href={`/${locale}/recipes/new`}
            id="nav-add-recipe"
            className="hidden sm:flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all"
          >
            + {t.addRecipe}
          </Link>
        </div>
      </nav>
    </header>
  );
}
