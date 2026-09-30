import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { useTranslation } from 'react-i18next'
import MagazinePage from './MagazinePage.jsx'
import MagazineControls from './MagazineControls.jsx'

const BASE_WIDTH = 420
const BASE_HEIGHT = 594
const FLIP_DURATION_MS = 1000
const SIZE_STEP = 8

/** Keep book sizes on a coarse grid so tiny resize noise cannot remount the book. */
const quantize = (value) => Math.max(SIZE_STEP, Math.round(value / SIZE_STEP) * SIZE_STEP)

/**
 * Derive page size from container width + window height.
 * Do not use the shell's own height — that creates a ResizeObserver feedback loop
 * (size change → shell height change → size change) which looks like shaking.
 */
const getBookSize = (containerWidth, isFullscreen) => {
  const horizontalPad = isFullscreen ? 48 : 16
  const availableWidth = Math.max(containerWidth - horizontalPad, 280)
  const availableHeight = Math.max(
    window.innerHeight * (isFullscreen ? 0.78 : 0.58) - (isFullscreen ? 96 : 32),
    300,
  )

  const maxSpreadWidth = Math.min(availableWidth, isFullscreen ? 1280 : 980)
  let pageWidth = quantize(maxSpreadWidth / 2)
  let pageHeight = Math.round((pageWidth / BASE_WIDTH) * BASE_HEIGHT)

  if (pageHeight > availableHeight) {
    pageHeight = quantize(availableHeight)
    pageWidth = quantize((pageHeight / BASE_HEIGHT) * BASE_WIDTH)
  }

  const maxPageWidth = isFullscreen ? 560 : BASE_WIDTH
  pageWidth = Math.min(Math.max(200, pageWidth), maxPageWidth)
  pageWidth = quantize(pageWidth)
  pageHeight = Math.round((pageWidth / BASE_WIDTH) * BASE_HEIGHT)

  return { width: pageWidth, height: pageHeight }
}

const getCoverOffset = (page, pageWidth, pageCount) => {
  if (page <= 1) return -Math.round(pageWidth / 2)
  if (page >= pageCount) return Math.round(pageWidth / 2)
  return 0
}

const fillTemplate = (template, values) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template || '',
  )

const MagazineFlipBook = ({
  pages: pageList = [],
  pdfUrl = '',
  pdfFilename = '',
  downloadClassName = '',
  downloadStyle,
  labels: labelOverrides = {},
}) => {
  const { t } = useTranslation()
  const pages = useMemo(
    () => (Array.isArray(pageList) ? pageList.filter((page) => page?.src) : []),
    [pageList],
  )
  const pageCount = pages.length
  const pageCountRef = useRef(pageCount)
  pageCountRef.current = pageCount
  const bookRef = useRef(null)
  const shellRef = useRef(null)
  const currentPageRef = useRef(1)
  const pageWidthRef = useRef(BASE_WIDTH)
  const sizeRafRef = useRef(0)

  const [currentPage, setCurrentPage] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [bookOffsetX, setBookOffsetX] = useState(() => -Math.round(BASE_WIDTH / 2))
  const [offsetTransition, setOffsetTransition] = useState(false)
  const [bookSize, setBookSize] = useState(() =>
    getBookSize(typeof window !== 'undefined' ? window.innerWidth - 48 : BASE_WIDTH * 2, false),
  )

  useEffect(() => {
    currentPageRef.current = currentPage
  }, [currentPage])

  useEffect(() => {
    pageWidthRef.current = bookSize.width
  }, [bookSize.width])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined

    const applySize = () => {
      const next = getBookSize(shell.clientWidth, isFullscreen)
      setBookSize((prev) =>
        prev.width === next.width && prev.height === next.height ? prev : next,
      )
    }

    const scheduleSize = () => {
      cancelAnimationFrame(sizeRafRef.current)
      sizeRafRef.current = requestAnimationFrame(applySize)
    }

    applySize()

    // Observe width only via the shell; height comes from the window to avoid loops.
    const observer = new ResizeObserver(scheduleSize)
    observer.observe(shell)
    window.addEventListener('resize', scheduleSize)

    return () => {
      cancelAnimationFrame(sizeRafRef.current)
      observer.disconnect()
      window.removeEventListener('resize', scheduleSize)
    }
  }, [isFullscreen])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    // Snap cover offset when the book is remounted at a new size (no transition).
    setOffsetTransition(false)
    setBookOffsetX(
      getCoverOffset(currentPageRef.current, bookSize.width, pageCountRef.current),
    )
  }, [bookSize.width])

  const pageFlip = useCallback(() => bookRef.current?.pageFlip?.() ?? null, [])

  const previewOffset = useCallback((direction) => {
    const page = currentPageRef.current
    const width = pageWidthRef.current

    setOffsetTransition(true)
    if (direction === 0) {
      setBookOffsetX(page >= pageCountRef.current - 1 ? width / 2 : 0)
      return
    }
    setBookOffsetX(page <= 2 ? -width / 2 : 0)
  }, [])

  const handleFlip = useCallback((event) => {
    const nextPage = event.data + 1
    currentPageRef.current = nextPage
    setCurrentPage(nextPage)
    setBookOffsetX(getCoverOffset(nextPage, pageWidthRef.current, pageCountRef.current))
  }, [])

  const handleChangeState = useCallback(
    (event) => {
      if (event.data === 'flipping') {
        const direction = pageFlip()?.getRender?.()?.getDirection?.()
        if (direction === 0 || direction === 1) previewOffset(direction)
        return
      }

      if (event.data === 'read') {
        setOffsetTransition(false)
        setBookOffsetX(
          getCoverOffset(currentPageRef.current, pageWidthRef.current, pageCountRef.current),
        )
      }
    },
    [pageFlip, previewOffset],
  )

  const handleInit = useCallback(() => {
    const targetIndex = Math.max(0, currentPageRef.current - 1)
    setOffsetTransition(false)
    setBookOffsetX(
      getCoverOffset(currentPageRef.current, pageWidthRef.current, pageCountRef.current),
    )
    if (targetIndex === 0) return

    requestAnimationFrame(() => {
      pageFlip()?.turnToPage(targetIndex)
    })
  }, [pageFlip])

  const handlePrev = () => {
    previewOffset(1)
    pageFlip()?.flipPrev('bottom')
  }

  const handleNext = () => {
    previewOffset(0)
    pageFlip()?.flipNext('bottom')
  }

  const handleToggleFullscreen = async () => {
    const shell = shellRef.current
    if (!shell) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await shell.requestFullscreen()
      }
    } catch {
      // Fullscreen can be blocked by the browser; keep the viewer usable.
    }
  }

  const isCoverView = currentPage === 1
  const isBackCover = pageCount > 0 && currentPage === pageCount
  const isSinglePage = (isCoverView || isBackCover) && !offsetTransition

  // Clip to one page on covers so the empty opposite half (and spine shadow) is hidden.
  const frameWidth = isSinglePage ? bookSize.width : bookSize.width * 2
  const bookShiftX = isSinglePage
    ? isCoverView
      ? -bookSize.width
      : 0
    : bookOffsetX

  const pageLabel = useMemo(() => {
    if (isCoverView || isBackCover) {
      return fillTemplate(labelOverrides.pageOf || t('magazineView.controls.pageOf'), {
        current: currentPage,
        total: pageCount,
      })
    }

    const rightPage = Math.min(currentPage + 1, pageCount)
    return fillTemplate(labelOverrides.spreadOf || t('magazineView.controls.spreadOf'), {
      start: currentPage,
      end: rightPage,
      total: pageCount,
    })
  }, [currentPage, isBackCover, isCoverView, labelOverrides.pageOf, labelOverrides.spreadOf, pageCount, t])

  const labels = useMemo(
    () => ({
      prev: labelOverrides.prev || t('magazineView.controls.prev'),
      next: labelOverrides.next || t('magazineView.controls.next'),
      download: labelOverrides.download || t('magazineView.controls.download'),
      pageOf: pageLabel,
      fullscreen: isFullscreen
        ? labelOverrides.exitFullscreen || t('magazineView.controls.exitFullscreen')
        : labelOverrides.fullscreen || t('magazineView.controls.fullscreen'),
    }),
    [isFullscreen, labelOverrides, pageLabel, t],
  )

  if (!pageCount) return null

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div
        ref={shellRef}
        className={`flex w-full flex-col justify-center overflow-hidden rounded-2xl bg-200/60 px-2 py-6 sm:px-4 md:py-8 ${
          isFullscreen
            ? 'h-full min-h-screen rounded-none! bg-secondary-2 px-4 py-6 md:px-8 md:py-8'
            : ''
        }`}
      >
        <div className="mx-auto flex w-full max-w-360 flex-1 flex-col justify-center gap-5">
          <div className="flex justify-center overflow-hidden">
            <div
              className={`relative overflow-hidden ${
                isSinglePage ? 'shadow-[0_20px_48px_rgba(1,38,59,0.22)]' : ''
              }`}
              style={{
                width: frameWidth,
                height: bookSize.height,
                transition: offsetTransition
                  ? `width ${FLIP_DURATION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
                  : 'none',
              }}
            >
              <div
                style={{
                  width: bookSize.width * 2,
                  height: bookSize.height,
                  transform: `translate3d(${bookShiftX}px, 0, 0)`,
                  transition: offsetTransition
                    ? `transform ${FLIP_DURATION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
                    : 'none',
                }}
              >
                <HTMLFlipBook
                  key={`${bookSize.width}x${bookSize.height}`}
                  ref={bookRef}
                  width={bookSize.width}
                  height={bookSize.height}
                  size="fixed"
                  minWidth={200}
                  maxWidth={isFullscreen ? 560 : BASE_WIDTH}
                  minHeight={280}
                  maxHeight={isFullscreen ? 780 : BASE_HEIGHT}
                  drawShadow={!isSinglePage}
                  flippingTime={FLIP_DURATION_MS}
                  usePortrait={false}
                  startPage={0}
                  autoSize={false}
                  maxShadowOpacity={isSinglePage ? 0 : 0.45}
                  showCover
                  mobileScrollSupport
                  clickEventForward={false}
                  useMouseEvents
                  swipeDistance={20}
                  showPageCorners
                  disableFlipByClick={false}
                  className={`magazine-flipbook ${
                    isSinglePage
                      ? 'magazine-flipbook--single'
                      : 'shadow-[0_20px_48px_rgba(1,38,59,0.22)]'
                  }`}
                  onFlip={handleFlip}
                  onChangeState={handleChangeState}
                  onInit={handleInit}
                >
                  {pages.map((page, index) => (
                    <MagazinePage
                      key={page.id || index}
                      src={page.src}
                      alt={page.alt || ''}
                      pageNumber={index + 1}
                      isCover={index === 0 || index === pages.length - 1}
                    />
                  ))}
                </HTMLFlipBook>
              </div>
            </div>
          </div>

          {isFullscreen ? (
            <MagazineControls
              currentPage={currentPage}
              totalPages={pageCount}
              canGoPrev={currentPage > 1}
              canGoNext={currentPage < pageCount}
              pdfUrl={pdfUrl}
              pdfFilename={pdfFilename}
              downloadClassName={downloadClassName}
              downloadStyle={downloadStyle}
              isFullscreen={isFullscreen}
              onPrev={handlePrev}
              onNext={handleNext}
              onToggleFullscreen={handleToggleFullscreen}
              labels={labels}
            />
          ) : null}
        </div>
      </div>

      {!isFullscreen ? (
        <MagazineControls
          currentPage={currentPage}
          totalPages={pageCount}
          canGoPrev={currentPage > 1}
          canGoNext={currentPage < pageCount}
          pdfUrl={pdfUrl}
          pdfFilename={pdfFilename}
          downloadClassName={downloadClassName}
          downloadStyle={downloadStyle}
          isFullscreen={isFullscreen}
          onPrev={handlePrev}
          onNext={handleNext}
          onToggleFullscreen={handleToggleFullscreen}
          labels={labels}
        />
      ) : null}
    </div>
  )
}

export default MagazineFlipBook
