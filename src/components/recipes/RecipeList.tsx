import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/recipes/RecipeCard";
import type { Locale } from "@/proxy";
import { Recipe } from "@prisma/client";

export default async function RecipeList({ locale }: { locale: string }) {

  
  let recipes: (Recipe & { _count: { comments: number } })[] = [];
  let dbError = false;

  try {
    recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { comments: true } } },
    });
  } catch (err) {
    console.error("[RecipesList] Database error:", err);
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="py-24 text-center border-2 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 rounded-3xl">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            Impossible de se connecter à la base de données.
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-sm mt-1">
            Vérifiez votre variable DATABASE_URL dans le fichier .env
          </p>
        </div>
    );
  }
  if (recipes.length === 0) {
    return (
      <div className="py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-zinc-500">Aucune recette trouvée.</p>
      </div>
    );
  }

  return (
/*     <main className="min-h-screen bg-white p-8 md:p-16">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-light text-slate-900 mb-12">
          Nos <span className="italic font-serif">Recettes</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              prepTime={recipe.prepTime}
              coverImage={recipe.coverImage}
            />
          ))}
        </div>
      </div>
    </main> */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id}
          recipe={recipe}
          locale={locale as Locale}
        />
      ))}
    </div>
  );
}