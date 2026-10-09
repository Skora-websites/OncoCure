import { RevealBlock } from '../anim/SplitReveal.jsx';
import { buildHash, navigate } from '../../lib/hashRoute.js';

/**
 * Pagination — offset pagination for the Services and Blogs listings.
 *
 * State lives in the hash (`#/services?page=2`), so a page is shareable and
 * restorable; page 1 is the canonical URL and carries no param. Prev/Next are
 * real pill buttons that disable at the ends; the position line reads
 * "Showing 1–6 of 12".
 */
export default function Pagination({ path, params = {}, total, offset, limit, onPage }) {
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(total, offset + limit);

  const go = (nextPage) => {
    if (nextPage < 1 || nextPage > pageCount || nextPage === page) return;
    onPage?.();
    navigate(path, { ...params, page: nextPage === 1 ? undefined : nextPage });
  };

  const pill =
    'group relative inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full border px-5 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500 select-none sm:gap-3 sm:px-6 sm:py-3';
  const enabled = 'border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream';
  const disabled = 'cursor-default border-ink/10 text-ink/30';

  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-col items-center gap-5">
      <RevealBlock y={14}>
        <p className="text-sm text-ink-45" aria-live="polite">
          Showing <span className="text-ink">{from}–{to}</span> of{' '}
          <span className="text-ink">{total}</span>
        </p>
      </RevealBlock>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          aria-disabled={page <= 1}
          className={`${pill} ${page <= 1 ? disabled : enabled}`}
        >
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-x-1">
            &larr;
          </span>
          Previous
        </button>

        {pageCount > 1 ? (
          <ol className="flex items-center gap-2" aria-current={page}>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => go(n)}
                  aria-label={`Page ${n}`}
                  aria-current={n === page ? 'page' : undefined}
                  className={`h-11 w-11 rounded-full border text-[0.6875rem] font-semibold transition-colors duration-300 ${
                    n === page
                      ? 'border-plum-800 bg-plum-800 text-cream'
                      : 'border-ink/15 text-ink-70 hover:border-ink/40 hover:text-ink'
                  }`}
                >
                  {n}
                </button>
              </li>
            ))}
          </ol>
        ) : null}

        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page >= pageCount}
          aria-disabled={page >= pageCount}
          className={`${pill} ${page >= pageCount ? disabled : enabled}`}
        >
          Next
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            &rarr;
          </span>
        </button>
      </div>
    </nav>
  );
}

export { buildHash };
