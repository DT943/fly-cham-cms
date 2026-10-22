import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

// An arrow at either end of the range is disabled (grey); an active one is
// the secondary fill.
const arrowClass = (disabled) =>
  `flex size-10 shrink-0 items-center justify-center rounded-full border-0 ${
    disabled ? 'bg-300 text-50 cursor-default' : 'bg-secondary text-btn cursor-pointer'
  }`

const DestinationsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel,
  nextLabel,
  ofText,
}) => {
  const prevDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        aria-label={previousLabel}
        disabled={prevDisabled}
        onClick={() => onPageChange(currentPage - 1)}
        className={arrowClass(prevDisabled)}
      >
        <ArrowLeft size={18} className="rtl:-scale-x-100" />
      </button>

      <p className={`${typography.caption} m-0`} aria-live="polite">
        <span className="font-semibold text-800">{currentPage}</span>
        <span className="text-500"> {ofText}</span>
      </p>

      <button
        type="button"
        aria-label={nextLabel}
        disabled={nextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
        className={arrowClass(nextDisabled)}
      >
        <ArrowRight size={18} className="rtl:-scale-x-100" />
      </button>
    </div>
  )
}

export default DestinationsPagination
