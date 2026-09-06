import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const DestinationsPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel,
  nextLabel,
  ofLabel,
}) => {
  const atStart = currentPage <= 1
  const atEnd = currentPage >= totalPages

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        aria-label={previousLabel}
        disabled={atStart}
        onClick={() => onPageChange(currentPage - 1)}
        className={`w-9 h-9 rounded-full border flex items-center justify-center bg-background transition-all duration-200 ease-out motion-reduce:transition-none ${
          atStart
            ? 'border-200 text-400 cursor-default opacity-30'
            : 'border-200 text-800 cursor-pointer hover:scale-110 hover:bg-100'
        }`}
      >
        <CaretLeft size={16} weight="bold" className="rtl:hidden" />
        <CaretRight size={16} weight="bold" className="hidden rtl:block" />
      </button>

      <p key={currentPage} className={`${typography.caption} text-800 m-0 animate-[fadeSlide_0.25s_ease-out]`}>
        <span className="font-semibold">{currentPage}</span>
        <span className="text-500"> {ofLabel}</span>
      </p>

      <button
        type="button"
        aria-label={nextLabel}
        disabled={atEnd}
        onClick={() => onPageChange(currentPage + 1)}
        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ease-out motion-reduce:transition-none ${
          atEnd
            ? 'border-200 bg-background text-400 cursor-default opacity-30'
            : 'border-primary-1 bg-primary-1 text-50 cursor-pointer hover:scale-110 hover:bg-[#007A9E]'
        }`}
      >
        <CaretRight size={16} weight="bold" className="rtl:hidden" />
        <CaretLeft size={16} weight="bold" className="hidden rtl:block" />
      </button>
    </div>
  )
}

export default DestinationsPagination
