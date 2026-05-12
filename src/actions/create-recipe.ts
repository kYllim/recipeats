"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  recipeFormSchema,
} from "@/lib/recipe-schema";

export type CreateRecipeState =
  | { success: true }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      formError?: string;
    };

export async function createRecipe(
  locale: string,
  formData: FormData,
): Promise<CreateRecipeState> {
  const rawIngredients = formData.get("ingredients");
  let ingredients: unknown = [];
  if (typeof rawIngredients === "string") {
    try {
      ingredients = JSON.parse(rawIngredients);
    } catch {
      return {
        success: false,
        formError: "Format des ingredients invalide.",
      };
    }
  }

  const parsed = recipeFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    prepTime: formData.get("prepTime"),
    difficulty: formData.get("difficulty"),
    instructions: formData.get("instructions"),
    ingredients,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { success: false, fieldErrors };
  }

  let imagePath: string | null = null;
  const imageEntry = formData.get("image");
  if (imageEntry instanceof File && imageEntry.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageEntry.type)) {
      return {
        success: false,
        fieldErrors: { image: "imageType" },
      };
    }
    if (imageEntry.size > MAX_IMAGE_SIZE) {
      return {
        success: false,
        fieldErrors: { image: "imageSize" },
      };
    }

    try {
      const bytes = Buffer.from(await imageEntry.arrayBuffer());
      const ext = imageEntry.type.split("/")[1] ?? "jpg";
      const filename = `${randomUUID()}.${ext}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, filename), bytes);
      imagePath = `/uploads/${filename}`;
    } catch (err) {
      console.error("[createRecipe] Image upload error:", err);
      return {
        success: false,
        formError: "Erreur lors de l'upload de l'image.",
      };
    }
  }

  let recipeId: string;
  try {
    const recipe = await prisma.recipe.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        prepTime: parsed.data.prepTime,
        difficulty: parsed.data.difficulty,
        instructions: parsed.data.instructions,
        image: imagePath,
        ingredients: {
          create: parsed.data.ingredients,
        },
      },
    });
    recipeId = recipe.id;
  } catch (err) {
    console.error("[createRecipe] DB error:", err);
    return {
      success: false,
      formError: "Erreur lors de l'enregistrement en base.",
    };
  }

  revalidatePath("/", "layout");
  revalidatePath(`/${locale}/recipes`);
  revalidatePath(`/${locale}`);

  redirect(`/${locale}/recipes/${recipeId}`);
}
