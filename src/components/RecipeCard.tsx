import Image from 'next/image';
import Link from 'next/link'

export default function RecipeCard({
  id,
  title,
  description,
  prepTime,
  coverImage, 
}: {
  id: string;
  title: string;
  description?: string | null;
  prepTime: number | null;
  coverImage?: string | null; 
}) {
  return (
    <Link href={`/recipes/${id}`} className="">
    <article className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      
      <div className="relative aspect-video w-full bg-slate-50">
        <Image
          src={coverImage || "/recipes/placeholder-recipe.png"} 
          alt={` ${title}`}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-medium text-slate-800">
          {title}
        </h3>

        {description && (
          <p className="text-slate-500 text-sm mt-2 line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 uppercase">
          <span className="bg-slate-50 px-2 py-1 rounded">
            {prepTime ? `${prepTime} MIN` : "RAPIDE"}
          </span>
        </div>
      </div>
    </article>
    </Link>
  );
}