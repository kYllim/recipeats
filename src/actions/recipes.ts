"use server";

import { prisma } from "@/lib/prisma";

export async function getRecipesByIds(ids: string[]) {
  if (!ids.length) return [];
  
  try {
    return await prisma.recipe.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        id: true,
        title: true,
        image: true,
        difficulty: true,
        prepTime: true,
      },
    });
  } catch (err) {
    console.error("[getRecipesByIds] Error:", err);
    return [];
  }
}
