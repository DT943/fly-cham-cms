import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { MIN_GALLERY_IMAGES } from '../utils/newsArticles.js'

const NewsDetailGallery = ({ images = [], altPrefix = '' }) => {
  const { t } = useTranslation()
  const trackRef = useRef(null)
  const slideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideStep, setSlideStep] = useState(0)
  const [visibleCount, setVisibleCount] = useState(2)

  const galleryImages = useMemo(
    () => (images.length >= MIN_GALLERY_IMAGES ? images.slice(0, images.length) : []),
    [images],
  )

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const syncVisibleCount = () => setVisibleCount(media.matches ? 2 : 1)

    syncVisibleCount()
    media.addEventListener('change', syncVisibleCount)
    return () => media.removeEventListener('change', syncVisibleCount)
  }, [])

  const maxIndex = useMemo(
    () => Math.max(0, galleryImages.length - visibleCount),
    [galleryImages.length, visibleCount],
  )

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
  }, [measureSlideStep, galleryImages.length, visibleCount])

  const progress = maxIndex === 0 ? 100 : (activeIndex / maxIndex) * 100

  const scrollToIndex = (index) => {
    setActiveIndex(Math.min(Math.max(index, 0), maxIndex))
  }

  if (galleryImages.length < MIN_GALLERY_IMAGES) return null

  return (
    <section className="flex flex-col gap-4 md:gap-5">
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-4 transition-transform duration-300 ease-out will-change-transform md:gap-5"
          style={{ transform: `translate3d(-${activeIndex * slideStep}px, 0, 0)` }}
        >
          {galleryImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              ref={index === 0 ? slideRef : null}
              className="w-[calc(100%-2.5rem)] shrink-0 overflow-hidden rounded-2xl md:w-[calc(50%-0.625rem)]"
            >
              <img
                src={src}
                alt={`${altPrefix} ${index + 1}`.trim()}
                className="aspect-[4/3] w-full object-cover md:aspect-[16/10]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:gap-6">
        <div className="h-1 w-full max-w-[min(100%,18rem)] rounded-full bg-200 md:max-w-[calc(50%-0.625rem)]">
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
            className="grid size-9 place-items-center rounded-full border border-primary-1 bg-background text-primary-1 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:size-10"
          >
            <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex >= maxIndex}
            aria-label={t('newsDetail.gallery.next')}
            className="grid size-9 place-items-center rounded-full bg-primary-1 text-50 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:size-10"
          >
            <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default NewsDetailGallery
