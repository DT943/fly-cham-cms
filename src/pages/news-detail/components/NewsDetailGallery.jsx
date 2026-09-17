import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { MIN_GALLERY_IMAGES } from '../utils/newsArticles.js'

const SLIDE_WIDTH = 'w-[calc(100%-2.5rem)] md:w-[62%]'

const NewsDetailGallery = ({ images = [], altPrefix = '' }) => {
  const { t, i18n } = useTranslation()
  const trackRef = useRef(null)
  const slideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideStep, setSlideStep] = useState(0)

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

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || track.style.gap) || 16
    setSlideStep(slide.offsetWidth + gap)
  }, [])

  useEffect(() => {
    measureSlideStep()
    window.addEventListener('resize', measureSlideStep)
    return () => window.removeEventListener('resize', measureSlideStep)
  }, [measureSlideStep, galleryImages.length])

  const progress = galleryImages.length === 0
    ? 0
    : ((activeIndex + 1) / galleryImages.length) * 100

  const scrollToIndex = (index) => {
    setActiveIndex(Math.min(Math.max(index, 0), maxIndex))
  }

  if (galleryImages.length < MIN_GALLERY_IMAGES) return null

  return (
    <section className="relative me-[calc(50%-50vw)] w-[calc(50%+50vw)] min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-3 overflow-x-clip md:gap-4">
        <div className="w-full min-w-0 overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-full gap-4 transition-transform duration-300 ease-out will-change-transform"
            style={{
              transform: `translate3d(${isRtl ? '' : '-'}${activeIndex * slideStep}px, 0, 0)`,
            }}
          >
            {galleryImages.map((src, index) => (
              <div
                key={`${src}-${index}`}
                ref={index === 0 ? slideRef : null}
                className={`${SLIDE_WIDTH} shrink-0 grow-0 basis-[calc(100%-2.5rem)] overflow-hidden rounded-2xl md:basis-[62%]`}
              >
                <img
                  src={src}
                  alt={`${altPrefix} ${index + 1}`.trim()}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className={`flex items-center gap-4 ${SLIDE_WIDTH}`}>
          <div className="h-1 min-w-0 flex-1 rounded-full bg-200">
            <div
              className="h-full rounded-full bg-primary-1 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label={t('newsDetail.gallery.prev')}
              className="grid size-8 place-items-center rounded-full border border-primary-1 bg-background text-primary-1 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CaretLeft size={14} weight="bold" className="rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex >= maxIndex}
              aria-label={t('newsDetail.gallery.next')}
              className="grid size-8 place-items-center rounded-full bg-primary-1 text-50 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CaretRight size={14} weight="bold" className="rtl:-scale-x-100" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsDetailGallery
