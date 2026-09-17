import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const RecentNewsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel,
  nextLabel,
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 md:gap-3"
    >
      <button
        type="button"
        aria-label={previousLabel}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`flex size-10 shrink-0 items-center justify-center rounded-full border-0 ${
          currentPage <= 1
            ? 'cursor-default bg-200 text-500'
            : 'cursor-pointer bg-200 text-700 hover:bg-300'
        }`}
      >
        <ArrowLeft size={18} className="rtl:-scale-x-100" />
      </button>

      {pages.map((page) => {
        const isActive = page === currentPage

        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            className={`flex size-10 shrink-0 items-center justify-center rounded-full border-0 ${typography.caption} ${
              isActive
                ? 'cursor-default bg-primary-1 font-semibold text-50'
                : 'cursor-pointer bg-transparent font-medium text-700 hover:bg-200'
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
        className={`flex size-10 shrink-0 items-center justify-center rounded-full border-0 ${
          currentPage >= totalPages
            ? 'cursor-default bg-200 text-500'
            : 'cursor-pointer bg-primary-1 text-50 hover:bg-primary-800'
        }`}
      >
        <ArrowRight size={18} className="rtl:-scale-x-100" />
      </button>
    </nav>
  )
}

export default RecentNewsPagination
