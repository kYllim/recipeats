'use client';
import { useSearchParams, usePathname, useRouter  } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`/recipes?${params.toString()}`);
    };

  return (
    <div className="relative flex flex-1 shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="focus:border-0 active:border-0 w-full rounded-md  bg-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 text-slate-900"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}

      />
    </div>
  );
}