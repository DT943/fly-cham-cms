import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CornersOut, DownloadSimple, Image } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { downloadGalleryImage, GalleryLightbox } from '../../../shared/components/galleryImageActions.jsx'
import { MIN_GALLERY_IMAGES } from '../utils/newsArticles.js'

const SLIDE_WIDTH =
  'w-[calc(100%-2.5rem)] shrink-0 grow-0 md:w-[calc(100%-50vw-5px)]'
const FIRST_SHIFT_RATIO = 740 / 981
const THUMB_RATIO = 162 / 779

// Figma arrow hover: the glyph slides 5px toward where it points (300ms ease-out).
const ARROW_NUDGE = {
  prev: 'group-hover/arrow:-translate-x-[5px] rtl:group-hover/arrow:translate-x-[5px]',
  next: 'group-hover/arrow:translate-x-[5px] rtl:group-hover/arrow:-translate-x-[5px]',
}

const fileTypeLabel = (src) => {
  const clean = String(src || '').split('?')[0].split('#')[0]
  const ext = clean.split('.').pop()
  if (!ext || ext === clean || ext.length > 5) return 'PNG'
  return ext.toUpperCase()
}

const NewsDetailGallery = ({ images = [], altPrefix = '' }) => {
  const { t, i18n } = useTranslation()
  const trackRef = useRef(null)
  const slideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [metrics, setMetrics] = useState({ step: 0, firstShift: 0 })
  const [expanded, setExpanded] = useState(null)
  const closeExpanded = useCallback(() => setExpanded(null), [])

  const galleryImages = useMemo(
    () => (images.length >= MIN_GALLERY_IMAGES ? images : []),
    [images],
  )

  const maxIndex = Math.max(0, galleryImages.length - 1)
  const isRtl = i18n.dir() === 'rtl'

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex))
  }, [maxIndex])

  const measureSlideStep = useCallback(() => {
    const slide = slideRef.current
    const track = trackRef.current
    if (!slide || !track) return

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || track.style.gap) || 10
    const width = slide.offsetWidth
    const step = width + gap
    const desktop = window.matchMedia('(min-width: 768px)').matches
    setMetrics({ step, firstShift: desktop ? width * FIRST_SHIFT_RATIO : step })
  }, [])

  useEffect(() => {
    measureSlideStep()
    window.addEventListener('resize', measureSlideStep)
    return () => window.removeEventListener('resize', measureSlideStep)
  }, [measureSlideStep, galleryImages.length])

  const scrollToIndex = (index) => {
    setActiveIndex(Math.min(Math.max(index, 0), maxIndex))
  }

  if (galleryImages.length < MIN_GALLERY_IMAGES) return null

  const thumbPct = THUMB_RATIO * 100
  const thumbOffset = maxIndex === 0 ? 0 : (activeIndex / maxIndex) * (100 - thumbPct)
  const scrollOffset =
    activeIndex === 0 ? 0 : metrics.firstShift + (activeIndex - 1) * metrics.step
  const prevEnabled = activeIndex > 0
  const nextEnabled = activeIndex < maxIndex
  const arrowClass = (enabled) =>
    `group/arrow grid size-[34px] shrink-0 place-items-center overflow-hidden rounded-full bg-[var(--rest-bg)] text-[var(--rest-fg)] transition-opacity duration-300 ${
      enabled ? 'cursor-pointer opacity-100' : 'cursor-default opacity-50'
    }`
  const arrowIconClass = (enabled, nudge) =>
    `rtl:-scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0,0,0.58,1)] ${enabled ? nudge : ''}`

  return (
    <>
    <section className="relative me-[calc(50%-50vw)] w-[calc(50%+50vw)] min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-3 md:gap-[26px]">
        {/* Clip window spans the viewport (start gutter added back as padding), so slides bleed past both edges. */}
        <div className="ms-[calc(100%-100vw)] min-w-0 overflow-hidden ps-[calc(100vw-100%)]">
          <div
            ref={trackRef}
            className="flex w-full gap-2.5 transition-transform duration-[350ms] ease-[cubic-bezier(0,0,0.58,1)] will-change-transform"
            style={{
              transform: `translate3d(${isRtl ? '' : '-'}${scrollOffset}px, 0, 0)`,
            }}
          >
            {galleryImages.map((src, index) => (
              <div
                key={`${src}-${index}`}
                ref={index === 0 ? slideRef : null}
                className={`group ${SLIDE_WIDTH} relative overflow-hidden rounded-2xl`}
              >
                <img
                  src={src}
                  alt={`${altPrefix} ${index + 1}`.trim()}
                  className="aspect-[603/387] w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={t('newsDetail.gallery.expand')}
                  onClick={() => setExpanded({ src, alt: `${altPrefix} ${index + 1}`.trim() })}
                  className="pointer-events-none absolute end-[3%] top-[4.3%] grid size-8 cursor-pointer place-items-center rounded-full bg-black/80 text-white opacity-0 transition-opacity duration-[350ms] ease-[cubic-bezier(0,0,0.58,1)] group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
                >
                  <CornersOut size={14} weight="bold" />
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[13.3%] items-center justify-between bg-[#1D1B20] px-[3.2%] text-white opacity-0 transition-opacity duration-[350ms] ease-[cubic-bezier(0,0,0.58,1)] group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100">
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Image size={16} weight="regular" />
                    {fileTypeLabel(src)}
                  </span>
                  <button
                    type="button"
                    aria-label={t('newsDetail.gallery.download')}
                    onClick={() => downloadGalleryImage(src)}
                    className="grid size-8 cursor-pointer place-items-center"
                  >
                    <DownloadSimple size={16} weight="regular" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 200%-100vw = the content column width; md+ places the row like Figma (354px in, 594px wide of 1220). */}
        <div className="flex w-[calc(200%-100vw)] items-center gap-4 md:ms-[calc((200%-100vw)*0.29)] md:w-[calc((200%-100vw)*0.487)] md:gap-[30px]">
          <div className="relative h-2 min-w-0 flex-1">
            <div className="absolute inset-0 rounded-full bg-200" />
            <div
              className="absolute inset-y-0 rounded-full bg-primary-1 transition-[inset-inline-start] duration-[350ms] ease-[cubic-bezier(0,0,0.58,1)]"
              style={{ width: `${thumbPct}%`, insetInlineStart: `${thumbOffset}%` }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={() => prevEnabled && scrollToIndex(activeIndex - 1)}
              aria-disabled={!prevEnabled}
              aria-label={t('newsDetail.gallery.prev')}
              className={arrowClass(prevEnabled)}
              style={{
                '--rest-bg': prevEnabled ? 'var(--color-primary-1)' : 'var(--color-200)',
                '--rest-fg': prevEnabled ? 'var(--color-50)' : '#5f5f5c',
              }}
            >
              <ArrowLeft size={20} className={arrowIconClass(prevEnabled, ARROW_NUDGE.prev)} />
            </button>
            <button
              type="button"
              onClick={() => nextEnabled && scrollToIndex(activeIndex + 1)}
              aria-disabled={!nextEnabled}
              aria-label={t('newsDetail.gallery.next')}
              className={arrowClass(nextEnabled)}
              style={{
                '--rest-bg': 'var(--color-primary-1)',
                '--rest-fg': 'var(--color-50)',
              }}
            >
              <ArrowRight size={20} className={arrowIconClass(nextEnabled, ARROW_NUDGE.next)} />
            </button>
          </div>
        </div>
      </div>
    </section>
    <GalleryLightbox
      image={expanded}
      onClose={closeExpanded}
      closeLabel={t('newsDetail.gallery.close')}
    />
    </>
  )
}

export default NewsDetailGallery
