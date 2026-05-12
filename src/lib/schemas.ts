import { z } from "zod";

export const commentSchema = z.object({
  author: z
    .string()
    .min(2, "authorMin")
    .max(50, "authorMax"),
  content: z
    .string()
    .min(10, "contentMin")
    .max(500, "contentMax"),
  rating: z
    .number()
    .int()
    .min(1, "ratingRequired")
    .max(5, "ratingRequired"),
  recipeId: z.string().min(1),
});

export type CommentFormData = z.infer<typeof commentSchema>;