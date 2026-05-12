import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: (await params).id },
    include: { ingredients: true }
  });
  if (!recipe) notFound();

  return (
    <main className="min-h-screen bg-white ">
      {recipe?.image && (
          <div className="relative h-[45vh] w-full bg-slate-50">
            <Image 
              src={recipe.image || "/recipes/placeholder-recipe.png"} 
              alt={recipe.title} 
              fill 
              className="object-cover"
              priority 
            />
          </div>
        )}
      <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white p-8 md:p-8 rounded-3xl shadow-xl border border-slate-50">

          <h1 className="text-3xl font-light text-slate-900 mb-6 text-center">
            <span className="italic font-serif">{recipe?.title}</span>
          </h1>
          
          <p className="text-slate-900 text-center mb-6">
            {recipe?.description}
          </p>

          <div className="flex gap-8 text-[0.75rem] justify-center font-bold text-slate-400 uppercase p-4 border-b border-slate-50">
            <div className="flex flex-col ">
              <span className="text-slate-900 mb-1 text-center">Temps</span>
              <span className="text-slate-900 text-center">{recipe?.prepTime} MIN</span>
            </div>
            <div className="flex flex-col border-l pl-8">
              <span className="text-slate-900 mb-1 text-center  ">Date de création</span>
              <span className="text-slate-900 text-center">{recipe?.createdAt.toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {recipe?.image && (
          <div className="relative h-[45vh] w-full bg-slate-50 mb-6 ">
            <Image 
              src={recipe.image || "/recipes/placeholder-recipe.png"} 
              alt={recipe.title} 
              fill 
              className="object-cover rounded-2xl"
              priority 
            />
          </div>
        )}

          

          <div className="flex flex-col md:flex-row gap-16">

            <div className="md:w-1/3">
              <h2 className="text-lg text-slate-900 mb-4 uppercase font-bold italic border-b">
                Ingrédients
              </h2>
              {recipe?.ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex justify-between items-center gap-4 mt-4">
                  <span className="text-slate-900 ">
                    {ingredient.name}
                  </span>
                  <span className="text-slate-900 text-sm border border-slate-900 px-3 py-1 rounded-full italic">{ingredient.quantity} {ingredient.unit}</span>
                </div>
              ))}
            </div>

            <div className="">
              <h2 className="text-lg text-slate-900 mb-4 uppercase font-bold italic border-b">
                Instructions
              </h2>
              <p className="text-slate-900">
                {recipe?.instructions}
              </p>
            </div>
          </div>

        </div>
        
      </div>
    </main>
  );
}