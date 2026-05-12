import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Navbar } from "@/components/Navbar";
import { getDictionary } from "@/i18n";
import { locales, hasLocale } from "@/proxy";
import { notFound } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
    title: { default: t.meta.homeTitle, template: `%s | RecipEats` },
    description: t.meta.homeDescription,
    metadataBase: new URL("https://recipeats.vercel.app"),
    openGraph: {
      siteName: t.meta.siteName,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;
  if (!locale || !hasLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <FavoritesProvider>
          <ToastProvider>
            <Navbar locale={locale} t={t.nav} />
            <main className="flex-1 w-full">{children}</main>
            <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-sm text-zinc-400">
              © {new Date().getFullYear()} RecipEats — Fait avec ❤️
            </footer>
          </ToastProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
