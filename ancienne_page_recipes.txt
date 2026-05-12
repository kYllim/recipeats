import RecipeList from "@/components/recipes/RecipeList";

export default async function Recipes() {
  return (
    <main className="min-h-screen bg-white p-8 md:p-16">
      <RecipeList />
    </main>
  );
}