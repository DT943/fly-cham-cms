import { useRef, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

/**
 * Dark navy strip of image thumbnails with gold round arrows, matching the
 * carousel that sits under each landmark. The active thumb carries a light
 * border; arrows scroll the row (and nudge the active index) so it stays usable
 * once the thumbnails overflow on narrow screens.
 */
const ThumbnailCarousel = ({ images = [], altPrefix = '' }) => {
  const { t } = useTranslation()
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)

  const scrollBy = (direction) => {
    const track = trackRef.current
    if (track) track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
    setActive((current) => {
      const next = current + direction
      return Math.min(Math.max(next, 0), images.length - 1)
    })
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary-2 p-3 shadow-[0_10px_15px_rgba(33,37,41,0.05)] sm:gap-4 sm:p-4">
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label={t('flightsToDamascus.carousel.prev')}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-900 text-white transition-opacity hover:opacity-90 sm:size-10"
      >
        <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
      </button>

      <div
        ref={trackRef}
        className="flex flex-1 gap-3 overflow-x-auto scroll-smooth sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, index) => (
          <button
            type="button"
            key={src}
            onClick={() => setActive(index)}
            aria-label={`${altPrefix} ${index + 1}`.trim()}
            aria-current={active === index}
            className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:h-[110px] sm:w-auto sm:flex-1 sm:basis-0 ${
              active === index ? 'border-2 border-solid border-50' : 'border-2 border-transparent'
            }`}
          >
            <img src={src} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label={t('flightsToDamascus.carousel.next')}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-900 text-white transition-opacity hover:opacity-90 sm:size-10"
      >
        <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
      </button>
    </div>
  )
}

export default ThumbnailCarousel
