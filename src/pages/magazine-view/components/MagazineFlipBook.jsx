import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { useTranslation } from 'react-i18next'
import MagazinePage from './MagazinePage.jsx'
import MagazineControls from './MagazineControls.jsx'
import {
  MAGAZINE_PAGE_COUNT,
  magazinePages,
} from '../utils/magazinePages.js'

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

const getCoverOffset = (page, pageWidth) => {
  if (page <= 1) return -Math.round(pageWidth / 2)
  if (page >= MAGAZINE_PAGE_COUNT) return Math.round(pageWidth / 2)
  return 0
}

const MagazineFlipBook = () => {
  const { t } = useTranslation()
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
    setBookOffsetX(getCoverOffset(currentPageRef.current, bookSize.width))
  }, [bookSize.width])

  const pageFlip = useCallback(() => bookRef.current?.pageFlip?.() ?? null, [])

  const previewOffset = useCallback((direction) => {
    const page = currentPageRef.current
    const width = pageWidthRef.current

    setOffsetTransition(true)
    if (direction === 0) {
      setBookOffsetX(page >= MAGAZINE_PAGE_COUNT - 1 ? width / 2 : 0)
      return
    }
    setBookOffsetX(page <= 2 ? -width / 2 : 0)
  }, [])

  const handleFlip = useCallback((event) => {
    const nextPage = event.data + 1
    currentPageRef.current = nextPage
    setCurrentPage(nextPage)
    setBookOffsetX(getCoverOffset(nextPage, pageWidthRef.current))
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
        setBookOffsetX(getCoverOffset(currentPageRef.current, pageWidthRef.current))
      }
    },
    [pageFlip, previewOffset],
  )

  const handleInit = useCallback(() => {
    const targetIndex = Math.max(0, currentPageRef.current - 1)
    setOffsetTransition(false)
    setBookOffsetX(getCoverOffset(currentPageRef.current, pageWidthRef.current))
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
  const isBackCover = currentPage === MAGAZINE_PAGE_COUNT
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
      return t('magazineView.controls.pageOf')
        .replace('{current}', String(currentPage))
        .replace('{total}', String(MAGAZINE_PAGE_COUNT))
    }

    const rightPage = Math.min(currentPage + 1, MAGAZINE_PAGE_COUNT)
    return t('magazineView.controls.spreadOf')
      .replace('{start}', String(currentPage))
      .replace('{end}', String(rightPage))
      .replace('{total}', String(MAGAZINE_PAGE_COUNT))
  }, [currentPage, isBackCover, isCoverView, t])

  const labels = useMemo(
    () => ({
      prev: t('magazineView.controls.prev'),
      next: t('magazineView.controls.next'),
      download: t('magazineView.controls.download'),
      pageOf: pageLabel,
      fullscreen: isFullscreen
        ? t('magazineView.controls.exitFullscreen')
        : t('magazineView.controls.fullscreen'),
    }),
    [isFullscreen, pageLabel, t],
  )

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
                  {magazinePages.map((page, index) => (
                    <MagazinePage
                      key={page.id}
                      src={page.src}
                      alt={t(`magazineView.pages.${page.id}`)}
                      pageNumber={index + 1}
                      isCover={index === 0 || index === magazinePages.length - 1}
                    />
                  ))}
                </HTMLFlipBook>
              </div>
            </div>
          </div>

          {isFullscreen ? (
            <MagazineControls
              currentPage={currentPage}
              totalPages={MAGAZINE_PAGE_COUNT}
              canGoPrev={currentPage > 1}
              canGoNext={currentPage < MAGAZINE_PAGE_COUNT}
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
          totalPages={MAGAZINE_PAGE_COUNT}
          canGoPrev={currentPage > 1}
          canGoNext={currentPage < MAGAZINE_PAGE_COUNT}
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
