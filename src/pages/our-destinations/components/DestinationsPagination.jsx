import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const DestinationsPagination = ({
  currentPage = 1,
  totalPages = 25,
  previousLabel,
  nextLabel,
  ofLabel,
}) => (
  <div className="flex items-center justify-center gap-4">
    <button
      type="button"
      aria-label={previousLabel}
      disabled
      className="flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-300 text-50 cursor-default"
    >
      <ArrowLeft size={18} className="rtl:-scale-x-100" />
    </button>

    <p className={`${typography.caption} m-0`}>
      <span className="font-semibold text-800">{currentPage}</span>
      <span className="text-500"> {ofLabel ?? `of ${totalPages}`}</span>
    </p>

    <button
      type="button"
      aria-label={nextLabel}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-secondary text-btn cursor-pointer"
    >
      <ArrowRight size={18} className="rtl:-scale-x-100" />
    </button>
  </div>
)

export default DestinationsPagination
