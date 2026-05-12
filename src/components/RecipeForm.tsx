"use client";

import { useState } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  recipeFormSchema,
  type RecipeFormValues,
} from "@/lib/recipe-schema";
import { createRecipe } from "@/actions/create-recipe";


type AddRecipeDict = {
  title: string;
  subtitle: string;
  fields: {
    title: string;
    titlePlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    prepTime: string;
    difficulty: string;
    instructions: string;
    instructionsPlaceholder: string;
    image: string;
    ingredients: string;
    ingredientName: string;
    ingredientQuantity: string;
    ingredientUnit: string;
  };
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
  actions: {
    addIngredient: string;
    removeIngredient: string;
    submit: string;
    submitting: string;
  };
  validation: Record<string, string>;
  errors: {
    generic: string;
  };
};

export function RecipeForm({
  locale,
  t,
}: {
  locale: string;
  t: AddRecipeDict;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      prepTime: 30,
      difficulty: "medium",
      instructions: "",
      ingredients: [{ name: "", quantity: 1, unit: "g" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const tError = (code?: string) =>
    code && code in t.validation ? t.validation[code] : code;

  const onSubmit: SubmitHandler<RecipeFormValues> = async (data) => {
    setSubmitting(true);
    setServerError(null);
    setImageError(null);

    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("description", data.description);
    fd.append("prepTime", String(data.prepTime));
    fd.append("difficulty", data.difficulty);
    fd.append("instructions", data.instructions);
    fd.append("ingredients", JSON.stringify(data.ingredients));

    const fileInput = document.getElementById(
      "recipe-image",
    ) as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (file) fd.append("image", file);

    try {
      const result = await createRecipe(locale, fd);
      if (result && result.success === false) {
        if (result.fieldErrors?.image) {
          setImageError(tError(result.fieldErrors.image) ?? t.errors.generic);
        }
        if (result.formError) {
          setServerError(result.formError);
        } else if (!result.fieldErrors) {
          setServerError(t.errors.generic);
        }
      }
    } catch (err) {
      const error = err as { digest?: string };
      if (error?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      console.error("[RecipeForm] submit error:", err);
      setServerError(t.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400";
  const labelClass =
    "block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* Titre */}
      <div>
        <label htmlFor="title" className={labelClass}>
          {t.fields.title}
        </label>
        <input
          id="title"
          type="text"
          placeholder={t.fields.titlePlaceholder}
          {...register("title")}
          className={inputClass}
        />
        {errors.title && (
          <p className={errorClass}>{tError(errors.title.message)}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          {t.fields.description}
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder={t.fields.descriptionPlaceholder}
          {...register("description")}
          className={inputClass}
        />
        {errors.description && (
          <p className={errorClass}>{tError(errors.description.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="prepTime" className={labelClass}>
            {t.fields.prepTime}
          </label>
          <input
            id="prepTime"
            type="number"
            min={1}
            {...register("prepTime")}
            className={inputClass}
          />
          {errors.prepTime && (
            <p className={errorClass}>{tError(errors.prepTime.message)}</p>
          )}
        </div>

        <div>
          <label htmlFor="difficulty" className={labelClass}>
            {t.fields.difficulty}
          </label>
          <select
            id="difficulty"
            {...register("difficulty")}
            className={inputClass}
          >
            <option value="easy">{t.difficulty.easy}</option>
            <option value="medium">{t.difficulty.medium}</option>
            <option value="hard">{t.difficulty.hard}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="recipe-image" className={labelClass}>
          {t.fields.image}
        </label>
        <input
          id="recipe-image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={inputClass}
        />
        {imageError && <p className={errorClass}>{imageError}</p>}
      </div>

      <div>
        <label className={labelClass}>{t.fields.ingredients}</label>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row gap-2 items-start"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder={t.fields.ingredientName}
                  {...register(`ingredients.${index}.name` as const)}
                  className={inputClass}
                />
                {errors.ingredients?.[index]?.name && (
                  <p className={errorClass}>
                    {tError(errors.ingredients[index]?.name?.message)}
                  </p>
                )}
              </div>
              <div className="w-24">
                <input
                  type="number"
                  step="0.1"
                  min={0}
                  placeholder={t.fields.ingredientQuantity}
                  {...register(`ingredients.${index}.quantity` as const)}
                  className={inputClass}
                />
                {errors.ingredients?.[index]?.quantity && (
                  <p className={errorClass}>
                    {tError(errors.ingredients[index]?.quantity?.message)}
                  </p>
                )}
              </div>
              <div className="w-24">
                <input
                  type="text"
                  placeholder={t.fields.ingredientUnit}
                  {...register(`ingredients.${index}.unit` as const)}
                  className={inputClass}
                />
                {errors.ingredients?.[index]?.unit && (
                  <p className={errorClass}>
                    {tError(errors.ingredients[index]?.unit?.message)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t.actions.removeIngredient}
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ name: "", quantity: 1, unit: "g" })}
            className="self-start text-sm font-semibold text-amber-600 hover:text-amber-700"
          >
            {t.actions.addIngredient}
          </button>

          {errors.ingredients?.message && (
            <p className={errorClass}>{tError(errors.ingredients.message)}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="instructions" className={labelClass}>
          {t.fields.instructions}
        </label>
        <textarea
          id="instructions"
          rows={6}
          placeholder={t.fields.instructionsPlaceholder}
          {...register("instructions")}
          className={inputClass}
        />
        {errors.instructions && (
          <p className={errorClass}>{tError(errors.instructions.message)}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/40 dark:border-red-900 p-4 text-sm text-red-700 dark:text-red-300">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-colors"
      >
        {submitting ? t.actions.submitting : t.actions.submit}
      </button>
    </form>
  );
}
