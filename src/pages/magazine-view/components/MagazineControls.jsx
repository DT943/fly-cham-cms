import { ArrowsOut, ArrowsIn, CaretLeft, CaretRight, DownloadSimple } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { MAGAZINE_PDF_FILENAME, MAGAZINE_PDF_URL } from '../utils/magazinePages.js'

const controlBtn =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-primary-1 bg-background px-4 font-semibold text-primary-1 transition-colors hover:bg-100 disabled:cursor-not-allowed disabled:opacity-40'

const MagazineControls = ({
  canGoPrev,
  canGoNext,
  isFullscreen,
  onPrev,
  onNext,
  onToggleFullscreen,
  labels,
}) => (
  <div
    className={`flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${
      isFullscreen ? 'rounded-xl bg-background/95 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)]' : ''
    }`}
  >
    <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label={labels.prev}
        className={`${controlBtn} flex-1 sm:flex-none`}
      >
        <CaretLeft size={18} weight="bold" className="rtl:-scale-x-100" />
        <span className="hidden sm:inline">{labels.prev}</span>
      </button>

      <p
        className={`m-0 min-w-0 flex-1 text-center font-medium text-700 sm:flex-none sm:min-w-28 ${typography.body}`}
      >
        {labels.pageOf}
      </p>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label={labels.next}
        className={`${controlBtn} flex-1 sm:flex-none`}
      >
        <span className="hidden sm:inline">{labels.next}</span>
        <CaretRight size={18} weight="bold" className="rtl:-scale-x-100" />
      </button>
    </div>

    <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
      <button
        type="button"
        onClick={onToggleFullscreen}
        aria-label={labels.fullscreen}
        className={`${controlBtn} flex-1 sm:flex-none`}
      >
        {isFullscreen ? <ArrowsIn size={18} weight="bold" /> : <ArrowsOut size={18} weight="bold" />}
        <span className="truncate">{labels.fullscreen}</span>
      </button>

      <a
        href={MAGAZINE_PDF_URL}
        download={MAGAZINE_PDF_FILENAME}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border-0 bg-secondary px-5 font-semibold text-btn no-underline transition-colors hover:bg-secondary-800 sm:flex-none ${typography.button}`}
      >
        <DownloadSimple size={18} weight="bold" />
        {labels.download}
      </a>
    </div>
  </div>
)

export default MagazineControls
