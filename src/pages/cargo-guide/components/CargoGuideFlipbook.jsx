import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PageFlip } from 'page-flip'
import {
  CaretLeft,
  CaretRight,
  CircleNotch,
  CornersIn,
  CornersOut,
  DownloadSimple,
} from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import './CargoGuideFlipbook.css'

/** Native size of one magazine page (a half spread is 512×649). */
const PAGE_WIDTH = 512
const PAGE_HEIGHT = 649
const MIN_PAGE_WIDTH = 260
const MIN_SPREAD_WIDTH = 560
/** Vertical space kept for the page controls (and fullscreen padding) below the book. */
const RESERVED_HEIGHT = 200
const FULLSCREEN_RESERVED_HEIGHT = 140
const PDF_FILE_NAME = 'fly-cham-cargo-guide.pdf'

/**
 * Book size and position in whole device pixels. The page images are never
 * enlarged past their native size, and the book never starts on a fractional
 * pixel — both blur the brochure text.
 */
const measureBook = (stage, fullscreen) => {
  const available = stage.clientWidth
  const portrait = available < MIN_PAGE_WIDTH * 2
  const nativeWidth = portrait ? PAGE_WIDTH : PAGE_WIDTH * 2
  const ratio = (portrait ? PAGE_WIDTH : PAGE_WIDTH * 2) / PAGE_HEIGHT
  const reserved = fullscreen ? FULLSCREEN_RESERVED_HEIGHT : RESERVED_HEIGHT
  const fitHeight = Math.max((window.innerHeight - reserved) * ratio, portrait ? 0 : MIN_SPREAD_WIDTH)
  const width = Math.floor(Math.min(nativeWidth, available, fitHeight) / 2) * 2

  const { left, top } = stage.getBoundingClientRect()
  return {
    width,
    marginLeft: Math.floor((available - width) / 2) - (left - Math.floor(left)),
    marginTop: Math.ceil(top) - top,
  }
}

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

/** One PDF page per brochure image (covers portrait, spreads landscape), at the image's own size. */
const downloadPdf = async (sources) => {
  const [{ jsPDF }, images] = await Promise.all([import('jspdf'), Promise.all(sources.map(loadImage))])
  let pdf = null
  for (const img of images) {
    const size = [img.naturalWidth, img.naturalHeight]
    const orientation = size[0] > size[1] ? 'landscape' : 'portrait'
    if (pdf) pdf.addPage(size, orientation)
    else pdf = new jsPDF({ unit: 'px', format: size, orientation, hotfixes: ['px_scaling'] })
    pdf.addImage(img, 'JPEG', 0, 0, size[0], size[1])
  }
  pdf?.save(PDF_FILE_NAME)
}

/**
 * `{ src, side }` → one page element. `side` crops a two-page spread image to
 * its 'left' or 'right' half; without it the image fills the page.
 */
const createPageElement = ({ src, side, hard }, alt) => {
  const page = document.createElement('div')
  page.className = 'cargo-guide-page'
  page.dataset.density = hard ? 'hard' : 'soft'

  const img = document.createElement('img')
  img.src = src
  img.alt = alt
  img.draggable = false
  img.decoding = 'async'
  img.className = side ? `cargo-guide-page__spread cargo-guide-page__spread--${side}` : 'cargo-guide-page__single'
  page.appendChild(img)
  return page
}

/**
 * Magazine viewer: drag a page (or its corner) to peel it over, or use the
 * arrows / keyboard. page-flip owns the book's DOM, so React only renders an
 * empty host and the controls around it.
 */
const CargoGuideFlipbook = ({ pages }) => {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const hostRef = useRef(null)
  const flipRef = useRef(null)
  const [current, setCurrent] = useState(0)
  const [landscape, setLandscape] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [layout, setLayout] = useState(null)

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const measure = () => {
      const next = measureBook(stage, fullscreen)
      setLayout((prev) =>
        prev &&
        prev.width === next.width &&
        prev.marginLeft === next.marginLeft &&
        prev.marginTop === next.marginTop
          ? prev
          : next,
      )
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [fullscreen])

  // page-flip sizes itself from the host; re-measure once React has applied a new width.
  useEffect(() => {
    const frame = requestAnimationFrame(() => flipRef.current?.update())
    return () => cancelAnimationFrame(frame)
  }, [layout?.width])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else rootRef.current?.requestFullscreen?.()
  }

  const download = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      await downloadPdf([...new Set(pages.map((page) => page.src))])
    } catch (error) {
      console.error('Cargo guide PDF download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const book = document.createElement('div')
    host.appendChild(book)
    const elements = pages.map((page, index) =>
      createPageElement(page, t('cargoGuide.pageAlt', { page: index + 1 })),
    )

    const flip = new PageFlip(book, {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      size: 'stretch',
      minWidth: MIN_PAGE_WIDTH,
      maxWidth: PAGE_WIDTH,
      minHeight: 330,
      maxHeight: 786,
      showCover: true,
      usePortrait: true,
      autoSize: true,
      drawShadow: true,
      maxShadowOpacity: 0.45,
      flippingTime: 900,
      mobileScrollSupport: true,
      swipeDistance: 30,
      showPageCorners: true,
    })
    flip.on('init', (event) => setLandscape(event.data.mode === 'landscape'))
    flip.on('flip', (event) => setCurrent(event.data))
    flip.on('changeOrientation', (event) => setLandscape(event.data === 'landscape'))
    flip.loadFromHTML(elements)
    flipRef.current = flip

    return () => {
      flipRef.current = null
      flip.destroy()
      book.remove()
    }
    // Pages are static for the lifetime of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowRight') flipRef.current?.flipNext()
      if (event.key === 'ArrowLeft') flipRef.current?.flipPrev()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const total = pages.length
  const isFirst = current === 0
  const isLast = current >= total - 1
  const onSpread = landscape && !isFirst && current < total - 1
  const pageLabel = onSpread ? `${current + 1}–${Math.min(current + 2, total)}` : `${current + 1}`

  // Closed covers sit on one half of a landscape spread; slide the book so it stays centred.
  const quarter = Math.round((layout?.width ?? 0) / 4)
  let shift = 0
  if (landscape && isFirst) shift = -quarter
  else if (landscape && isLast) shift = quarter

  const navButton =
    'inline-flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-primary-1 text-50 transition-colors hover:bg-primary-800 disabled:cursor-default disabled:bg-300 disabled:text-500'
  const toolButton =
    'inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-solid border-primary-1 bg-transparent text-primary-1 transition-colors hover:bg-primary-1 hover:text-50 disabled:cursor-wait disabled:opacity-60'

  return (
    <div
      ref={rootRef}
      className={`flex flex-col items-center gap-6 ${fullscreen ? 'h-full justify-center overflow-auto bg-100 px-4 py-6' : ''}`}
    >
      <div ref={stageRef} className="w-full overflow-hidden py-4" dir="ltr">
        <div
          ref={hostRef}
          className="cargo-guide-book transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(${shift}px)`,
            width: layout ? `${layout.width}px` : '100%',
            marginLeft: layout ? `${layout.marginLeft}px` : undefined,
            marginTop: layout ? `${layout.marginTop}px` : undefined,
            visibility: layout ? 'visible' : 'hidden',
          }}
          aria-label={t('cargoGuide.bookLabel')}
          role="region"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5" dir="ltr">
        <button
          type="button"
          onClick={() => flipRef.current?.flipPrev()}
          disabled={isFirst}
          aria-label={t('cargoGuide.previous')}
          className={navButton}
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <p className="m-0 min-w-24 text-center text-sm text-700 sm:min-w-32" aria-live="polite">
          {t('cargoGuide.pageOf', { page: pageLabel, total })}
        </p>
        <button
          type="button"
          onClick={() => flipRef.current?.flipNext()}
          disabled={isLast}
          aria-label={t('cargoGuide.next')}
          className={navButton}
        >
          <CaretRight size={20} weight="bold" />
        </button>

        <span className="h-8 w-px bg-300" aria-hidden />

        <button
          type="button"
          onClick={download}
          disabled={downloading}
          aria-label={t('cargoGuide.download')}
          title={t('cargoGuide.download')}
          className={toolButton}
        >
          {downloading ? (
            <CircleNotch size={20} weight="bold" className="animate-spin" />
          ) : (
            <DownloadSimple size={20} weight="bold" />
          )}
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={t(fullscreen ? 'cargoGuide.exitFullscreen' : 'cargoGuide.fullscreen')}
          title={t(fullscreen ? 'cargoGuide.exitFullscreen' : 'cargoGuide.fullscreen')}
          aria-pressed={fullscreen}
          className={toolButton}
        >
          {fullscreen ? <CornersIn size={20} weight="bold" /> : <CornersOut size={20} weight="bold" />}
        </button>
      </div>
    </div>
  )
}

export default CargoGuideFlipbook
