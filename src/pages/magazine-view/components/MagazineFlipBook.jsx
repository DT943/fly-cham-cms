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
const FLIP_DURATION_MS = 1100

const getBookSize = (containerWidth, containerHeight, isFullscreen) => {
  const availableWidth = Math.max(containerWidth - (isFullscreen ? 48 : 16), 280)
  const availableHeight = Math.max(
    (containerHeight || window.innerHeight * 0.7) - (isFullscreen ? 120 : 48),
    320,
  )

  // Spread width = 2 pages. Cover shows as a single centered page inside that frame.
  const maxSpreadWidth = Math.min(availableWidth, isFullscreen ? 1280 : 980)
  let pageWidth = Math.floor(maxSpreadWidth / 2)
  let pageHeight = Math.round((pageWidth / BASE_WIDTH) * BASE_HEIGHT)

  if (pageHeight > availableHeight) {
    pageHeight = Math.floor(availableHeight)
    pageWidth = Math.round((pageHeight / BASE_HEIGHT) * BASE_WIDTH)
  }

  pageWidth = Math.max(200, Math.min(pageWidth, isFullscreen ? 560 : BASE_WIDTH))
  pageHeight = Math.round((pageWidth / BASE_WIDTH) * BASE_HEIGHT)

  return {
    width: Math.round(pageWidth / 4) * 4,
    height: Math.round(pageHeight / 4) * 4,
  }
}

const MagazineFlipBook = () => {
  const { t } = useTranslation()
  const bookRef = useRef(null)
  const shellRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const currentPageRef = useRef(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [bookSize, setBookSize] = useState(() =>
    getBookSize(typeof window !== 'undefined' ? window.innerWidth - 48 : BASE_WIDTH * 2, undefined, false),
  )

  useEffect(() => {
    currentPageRef.current = currentPage
  }, [currentPage])

  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return undefined

    const updateSize = () => {
      setBookSize(getBookSize(shell.clientWidth, shell.clientHeight, isFullscreen))
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(shell)
    return () => observer.disconnect()
  }, [isFullscreen])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const pageFlip = useCallback(() => bookRef.current?.pageFlip?.() ?? null, [])

  const handleFlip = useCallback((event) => {
    setCurrentPage(event.data + 1)
  }, [])

  const handleInit = useCallback(() => {
    const targetIndex = Math.max(0, currentPageRef.current - 1)
    if (targetIndex === 0) return

    // Wait one frame so PageFlip finishes mounting before restoring position.
    window.requestAnimationFrame(() => {
      pageFlip()?.turnToPage(targetIndex)
    })
  }, [pageFlip])

  const handlePrev = () => pageFlip()?.flipPrev('bottom')
  const handleNext = () => pageFlip()?.flipNext('bottom')

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

  // showCover parks the front cover on the right and the back cover on the left.
  // Shift by half a page so single pages sit centered in the viewer.
  const bookOffsetX = useMemo(() => {
    if (isCoverView) return -bookSize.width / 2
    if (isBackCover) return bookSize.width / 2
    return 0
  }, [bookSize.width, isBackCover, isCoverView])

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
            ? 'h-full min-h-screen !rounded-none bg-secondary-2 px-4 py-6 md:px-8 md:py-8'
            : ''
        }`}
      >
        <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center gap-5">
          <div className="flex justify-center overflow-hidden">
            <div
              className="will-change-transform"
              style={{
                transform: `translate3d(${bookOffsetX}px, 0, 0)`,
                transition: `transform ${FLIP_DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
              }}
            >
              <HTMLFlipBook
                key={`${bookSize.width}x${bookSize.height}-${isFullscreen ? 'fs' : 'n'}`}
                ref={bookRef}
                width={bookSize.width}
                height={bookSize.height}
                size="fixed"
                minWidth={200}
                maxWidth={isFullscreen ? 560 : BASE_WIDTH}
                minHeight={280}
                maxHeight={isFullscreen ? 780 : BASE_HEIGHT}
                drawShadow
                flippingTime={FLIP_DURATION_MS}
                usePortrait={false}
                startPage={0}
                autoSize={false}
                maxShadowOpacity={0.55}
                showCover
                mobileScrollSupport
                clickEventForward={false}
                useMouseEvents
                swipeDistance={20}
                showPageCorners
                disableFlipByClick={false}
                className="magazine-flipbook shadow-[0_20px_48px_rgba(1,38,59,0.22)]"
                onFlip={handleFlip}
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
