import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CaretLeft, CaretRight, CornersOut, DownloadSimple, Image } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { colorVar } from '../../styles/cmsStyle.js'
import { downloadGalleryImage, GalleryLightbox } from './galleryImageActions.jsx'

export const MIN_GALLERY_IMAGES = 3

const SLIDE_WIDTH =
  'w-[calc(100%-2.5rem)] shrink-0 grow-0 md:w-[calc(100%-50vw-5px)]'
const FIRST_SHIFT_RATIO = 740 / 981
const THUMB_RATIO = 162 / 779

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const fileTypeLabel = (src) => {
  const clean = String(src || '').split('?')[0].split('#')[0]
  const ext = clean.split('.').pop()
  if (!ext || ext === clean || ext.length > 5) return 'PNG'
  return ext.toUpperCase()
}

/**
 * News detail image carousel: starts aligned with the content column and bleeds
 * to both viewport edges as it slides (Figma 41198:15946 prototype).
 * Needs at least MIN_GALLERY_IMAGES slides or renders nothing.
 */
const NewsDetailGallery = ({
  images = [],
  altPrefix = '',
  prevLabel = 'Previous photo',
  nextLabel = 'Next photo',
  imageRadius = '2xl',
  progressTrack = '200',
  progressFill = 'primary-1',
  nextBg = 'primary-1',
  nextIcon = '50',
}) => {
  const { t, i18n } = useTranslation()
  const trackRef = useRef(null)
  const slideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [metrics, setMetrics] = useState({ step: 0, firstShift: 0 })
  const [expanded, setExpanded] = useState(null)
  const closeExpanded = useCallback(() => setExpanded(null), [])

  const galleryImages = useMemo(() => {
    const list = Array.isArray(images) ? images.filter(Boolean) : []
    if (list.length >= MIN_GALLERY_IMAGES) return list
    return []
  }, [images])

  const maxIndex = Math.max(0, galleryImages.length - 1)
  const isRtl = i18n.dir() === 'rtl'

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex))
  }, [maxIndex])

  const measureSlideStep = useCallback(() => {
    const slide = slideRef.current
    const track = trackRef.current
    if (!slide || !track) return
    const gap =
      Number.parseFloat(window.getComputedStyle(track).columnGap || track.style.gap) || 10
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

  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS['2xl']
  const thumbPct = THUMB_RATIO * 100
  const thumbOffset = maxIndex === 0 ? 0 : (activeIndex / maxIndex) * (100 - thumbPct)
  const scrollOffset =
    activeIndex === 0 ? 0 : metrics.firstShift + (activeIndex - 1) * metrics.step
  const arrowColor = colorVar(nextBg)
  const prevEnabled = activeIndex > 0
  const nextEnabled = activeIndex < maxIndex

  const arrowClass = (enabled) =>
    `grid size-[34px] shrink-0 place-items-center rounded-full border border-transparent bg-[var(--rest-bg)] text-[var(--rest-fg)] transition-[background-color,color,border-color,opacity] duration-300 ease-out hover:border-[var(--arrow)] hover:bg-transparent hover:text-[var(--arrow)] hover:opacity-100 ${
      enabled ? 'cursor-pointer opacity-100' : 'cursor-default opacity-50'
    }`

  const expandLabel = t('newsDetail.gallery.expand')
  const downloadLabel = t('newsDetail.gallery.download')

  return (
    <>
    <section className="relative me-[calc(50%-50vw)] w-[calc(50%+50vw)] min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-3 md:gap-4">
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
                className={`group ${SLIDE_WIDTH} relative overflow-hidden ${radiusClass}`}
              >
                <img
                  src={src}
                  alt={`${altPrefix} ${index + 1}`.trim()}
                  className="aspect-[603/387] w-full object-cover"
                />
                <button
                  type="button"
                  aria-label={expandLabel}
                  onClick={() => setExpanded({ src, alt: `${altPrefix} ${index + 1}`.trim() })}
                  className="pointer-events-none absolute end-[3%] top-[4.3%] grid size-8 place-items-center rounded-full bg-black/80 text-white opacity-0 transition-opacity duration-[350ms] ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
                >
                  <CornersOut size={14} weight="bold" />
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[13.3%] items-center justify-between bg-[#1D1B20] px-[3.2%] text-white opacity-0 transition-opacity duration-[350ms] ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100">
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Image size={16} weight="regular" />
                    {fileTypeLabel(src)}
                  </span>
                  <button
                    type="button"
                    aria-label={downloadLabel}
                    onClick={() => downloadGalleryImage(src)}
                    className="grid size-8 place-items-center"
                  >
                    <DownloadSimple size={16} weight="regular" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center gap-4 md:w-[calc(200%-100vw)]">
          <div className="relative h-2 min-w-0 flex-1">
            <div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: colorVar(progressTrack) }}
            />
            <div
              className="absolute inset-y-0 rounded-full transition-[inset-inline-start] duration-[350ms] ease-[cubic-bezier(0,0,0.58,1)]"
              style={{
                width: `${thumbPct}%`,
                insetInlineStart: `${thumbOffset}%`,
                backgroundColor: colorVar(progressFill),
              }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={() => prevEnabled && scrollToIndex(activeIndex - 1)}
              aria-disabled={!prevEnabled}
              aria-label={prevLabel}
              className={arrowClass(prevEnabled)}
              style={{
                '--arrow': arrowColor,
                '--rest-bg': prevEnabled ? arrowColor : colorVar(progressTrack),
                '--rest-fg': prevEnabled ? colorVar(nextIcon) : '#5f5f5c',
              }}
            >
              <CaretLeft size={14} weight="bold" className="rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => nextEnabled && scrollToIndex(activeIndex + 1)}
              aria-disabled={!nextEnabled}
              aria-label={nextLabel}
              className={arrowClass(nextEnabled)}
              style={{
                '--arrow': arrowColor,
                '--rest-bg': arrowColor,
                '--rest-fg': colorVar(nextIcon),
              }}
            >
              <CaretRight size={14} weight="bold" className="rtl:-scale-x-100" />
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
