import Link from 'next/link';
import Search from '@/components/Search';


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between gap-8">
        <Link href="/" className="text-xl font-light tracking-tight text-slate-900 shrink-0">
          RECIP<span className="font-bold">EATS</span>
        </Link>

        <div className="flex-1 max-w-md">
            <Search placeholder="Rechercher une recette..." />
        </div>

        <div className="hidden md:block w-32" /> 
      </div>
    </header>
  );
}