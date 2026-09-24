import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

/**
 * Circular page controls matching the Travel Updates mock.
 */
const TravelUpdatesPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel,
  nextLabel,
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2.5 md:gap-3">
      <button
        type="button"
        aria-label={previousLabel}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`grid size-10 shrink-0 place-items-center rounded-full border-0 ${
          currentPage <= 1
            ? 'cursor-default bg-200 text-50'
            : 'cursor-pointer bg-200 text-700 hover:bg-300'
        }`}
      >
        <ArrowLeft size={18} weight="bold" className="rtl:-scale-x-100" />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage

        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            className={`grid size-10 shrink-0 place-items-center rounded-full ${typography.caption} ${
              isActive
                ? 'cursor-default border-0 bg-primary-1 font-semibold text-50'
                : 'cursor-pointer border border-200 bg-50 font-medium text-primary-1 hover:bg-100'
            }`}
          >
            {page}
          </button>
        )
      })}

      <button
        type="button"
        aria-label={nextLabel}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`grid size-10 shrink-0 place-items-center rounded-full border-0 ${
          currentPage >= totalPages
            ? 'cursor-default bg-200 text-50'
            : 'cursor-pointer bg-primary-1 text-50 hover:bg-primary-800'
        }`}
      >
        <ArrowRight size={18} weight="bold" className="rtl:-scale-x-100" />
      </button>
    </nav>
  )
}

export default TravelUpdatesPagination
