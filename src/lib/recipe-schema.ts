import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "ingredientName"),
  quantity: z.coerce.number().positive("ingredientQuantity"),
  unit: z.string().min(1, "ingredientUnit"),
});

export const recipeFormSchema = z.object({
  title: z.string().min(3, "titleMin").max(100, "titleMax"),
  description: z.string().min(10, "descriptionMin").max(500, "descriptionMax"),
  prepTime: z.coerce
    .number({ message: "prepTimeInvalid" })
    .int("prepTimeInvalid")
    .positive("prepTimeInvalid")
    .max(600, "prepTimeInvalid"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  instructions: z.string().min(10, "instructionsMin"),
  ingredients: z.array(ingredientSchema).min(1, "ingredientsMin"),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
export type IngredientFormValue = z.infer<typeof ingredientSchema>;

// Validation cote serveur de l'image uploadee
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 
