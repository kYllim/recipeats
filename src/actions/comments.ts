"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/proxy";

import { commentSchema, type CommentFormData } from "@/lib/schemas";

export async function createComment(
  locale: Locale,
  data: CommentFormData
): Promise<{ success: boolean; error?: string }> {
  const parsed = commentSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  try {
    await prisma.comment.create({
      data: {
        author: parsed.data.author,
        content: parsed.data.content,
        rating: parsed.data.rating,
        recipeId: parsed.data.recipeId,
      },
    });

    revalidatePath(`/${locale}/recipes/${parsed.data.recipeId}`);

    return { success: true };
  } catch (err) {
    console.error("[createComment]", err);
    return { success: false, error: "server_error" };
  }
}

export async function getComments(recipeId: string) {
  return prisma.comment.findMany({
    where: { recipeId },
    orderBy: { createdAt: "desc" },
  });

}