import { siteConfig } from "@/lib/site-config";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="text-safety" role="img" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
    </p>
  );
}

export default function Reviews() {
  const { reviews, googleReviewUrl } = siteConfig;
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="border-t border-line bg-tint-green">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-crate">Reviews</p>
        <h2 className="mt-2 max-w-xl text-3xl font-bold text-ink">What customers say</h2>
        <div
          className={
            reviews.length === 1
              ? "mx-auto mt-8 max-w-xl"
              : "mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {reviews.map((r) => (
            <figure key={`${r.name}-${r.text}`} className="rounded-lg border border-line bg-paper p-6">
              <Stars rating={r.rating} />
              <blockquote className="mt-3 text-ink/90">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-ink/70">
                <span className="font-semibold text-ink">{r.name}</span> · {r.town} · {r.package} ·{" "}
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline">
                    {r.source}
                  </a>
                ) : (
                  r.source
                )}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-crate px-5 py-3 font-semibold text-white hover:bg-crate-dark"
          >
            Leave a review on Google
          </a>
        </div>
      </div>
    </section>
  );
}
