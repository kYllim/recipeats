"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-3xl",
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      role={readonly ? "img" : "radiogroup"}
      aria-label={`Note : ${value} sur 5`}
      className="flex gap-0.5"
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role={readonly ? undefined : "radio"}
          aria-checked={value === star}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={[
            sizeMap[size],
            "transition-transform duration-150",
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded",
            star <= value ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600",
          ].join(" ")}
        >
          ★
        </button>
      ))}
    </div>
  );
}