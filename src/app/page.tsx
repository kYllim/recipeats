import { prisma } from "@/lib/prisma";
import RecipeCard from "@/components/RecipeCard";

export default async function HomePage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-white p-8 md:p-16">
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
    </main>
  );
}