import { getComments } from "@/actions/comments";
import { Comment } from "@prisma/client";
import { StarRating } from "@/components/StarRating";
import { CommentForm } from "@/components/CommentForm";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/proxy";

interface CommentListProps {
  recipeId: string;
  locale: Locale;
  t: Dictionary["comments"];
}

export async function CommentList({ recipeId, locale, t }: CommentListProps) {
  const comments = await getComments(recipeId);

  return (
    <section id="comments-section" className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {t.title}
        {comments.length > 0 && (
          <span className="ml-2 text-base font-normal text-zinc-500">
            ({comments.length})
          </span>
        )}
      </h2>

      <CommentForm recipeId={recipeId} locale={locale} t={t} />

      {comments.length === 0 ? (
        <p className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          {t.empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((comment: Comment, i: number) => (
            <li
              key={comment.id}
              id={`comment-${comment.id}`}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-sm animate-card-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden
                    className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-sm flex-shrink-0"
                  >
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                      {comment.author}
                    </p>
                    <time
                      dateTime={comment.createdAt.toISOString()}
                      className="text-xs text-zinc-400"
                    >
                      {t.on}{" "}
                      {comment.createdAt.toLocaleDateString(
                        locale === "fr" ? "fr-FR" : "en-US",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </time>
                  </div>
                </div>
                <StarRating value={comment.rating} readonly size="sm" />
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}