/**
 * One placeholder shape for loading states: a neutral block (`200` token) with
 * a soft shimmer sweeping across it in the reading direction (styles:
 * `.skeleton` in index.css; static under reduced motion). Size AND round it
 * with `className` (e.g. `h-4 w-2/3 rounded-md`); `delay` (ms) offsets the sweep so
 * several blocks shimmer as a wave.
 *
 * Purely decorative — the loading announcement belongs to the container
 * (see PageSkeleton), so every block is hidden from assistive tech.
 */
const Skeleton = ({ className = 'rounded-md', delay = 0 }) => (
  <div
    aria-hidden="true"
    className={`skeleton ${className}`}
    style={delay ? { '--skeleton-delay': `${delay}ms` } : undefined}
  />
)

export default Skeleton
