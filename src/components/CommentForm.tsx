"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { StarRating } from "@/components/StarRating";
import { useToast } from "@/contexts/ToastContext";
import { createComment } from "@/actions/comments";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/proxy";

function buildSchema(v: Dictionary["comments"]["validation"]) {
  return z.object({
    author: z.string().min(2, v.authorMin).max(50, v.authorMax),
    content: z.string().min(10, v.contentMin).max(500, v.contentMax),
    rating: z
    .number()
    .int()
    .min(1, v.ratingRequired)
    .max(5, v.ratingRequired),
  });
}

type FormData = z.infer<ReturnType<typeof buildSchema>>;

interface CommentFormProps {
  recipeId: string;
  locale: Locale;
  t: Dictionary["comments"];
}

export function CommentForm({ recipeId, locale, t }: CommentFormProps) {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const schema = buildSchema(t.validation);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { author: "", content: "", rating: 0 },
  });

  const currentRating = watch("rating");

  const onSubmit = async (data: FormData) => {
    const result = await createComment(locale, { ...data, recipeId });
    if (result.success) {
      showToast(t.success, "success");
      reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      showToast(t.error, "error");
    }
  };

  return (
    <form
      id="comment-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 flex flex-col gap-5 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {t.add}
      </h3>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="comment-author"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {t.author}
        </label>
        <input
          id="comment-author"
          type="text"
          placeholder={t.authorPlaceholder}
          autoComplete="name"
          {...register("author")}
          className={[
            "rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50",
            "placeholder:text-zinc-400 focus:outline-none focus:ring-2",
            errors.author
              ? "border-rose-400 focus:ring-rose-400"
              : "border-zinc-300 dark:border-zinc-600 focus:ring-amber-400",
          ].join(" ")}
        />
        {errors.author && (
          <p className="text-xs text-rose-500">{errors.author.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t.rating}
        </span>
        <StarRating
          value={currentRating}
          onChange={(v) => setValue("rating", v, { shouldValidate: true })}
        />
        {errors.rating && (
          <p className="text-xs text-rose-500">{errors.rating.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="comment-content"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {t.content}
        </label>
        <textarea
          id="comment-content"
          rows={4}
          placeholder={t.contentPlaceholder}
          {...register("content")}
          className={[
            "rounded-lg border px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50",
            "placeholder:text-zinc-400 focus:outline-none focus:ring-2 resize-none",
            errors.content
              ? "border-rose-400 focus:ring-rose-400"
              : "border-zinc-300 dark:border-zinc-600 focus:ring-amber-400",
          ].join(" ")}
        />
        {errors.content && (
          <p className="text-xs text-rose-500">{errors.content.message}</p>
        )}
        <p className="text-xs text-zinc-400 text-right">
          {watch("content")?.length ?? 0} / 500
        </p>
      </div>

      <button
        id="comment-submit"
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 disabled:opacity-60 text-white px-6 py-2.5 text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        {isSubmitting ? t.submitting : t.submit}
      </button>

      {submitted && (
        <p className="text-sm text-emerald-600 font-medium animate-fade-in">
          ✓ {t.success}
        </p>
      )}
    </form>
  );
}