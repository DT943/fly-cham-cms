import { useRef } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

/**
 * Dark navy strip of image thumbnails with gold round arrows, matching the
 * carousel that sits under each landmark. The active thumb carries a light
 * border; arrows scroll the row (and nudge the active index) so it stays usable
 * once the thumbnails overflow on narrow screens.
 */
const ThumbnailCarousel = ({ images = [], altPrefix = '', active = 0, onSelect }) => {
  const { t } = useTranslation()
  const trackRef = useRef(null)

  const select = (index) => {
    const last = images.length - 1
    if (last < 0) return

    const next = Math.min(Math.max(index, 0), last)
    onSelect?.(next)

    const track = trackRef.current
    const thumb = track?.children[next]
    if (!track || !thumb) return

    const thumbLeft = thumb.offsetLeft
    const thumbRight = thumbLeft + thumb.offsetWidth
    const viewLeft = track.scrollLeft
    const viewRight = viewLeft + track.clientWidth
    if (thumbLeft >= viewLeft && thumbRight <= viewRight) return

    track.scrollTo({
      left: thumbLeft - (track.clientWidth - thumb.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary-2 p-3 shadow-[0_10px_15px_rgba(33,37,41,0.05)] sm:gap-4 sm:p-4">
      <button
        type="button"
        onClick={() => select(active - 1)}
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
            onClick={() => select(index)}
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
        onClick={() => select(active + 1)}
        aria-label={t('flightsToDamascus.carousel.next')}
        className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-900 text-white transition-opacity hover:opacity-90 sm:size-10"
      >
        <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
      </button>
    </div>
  )
}

export default ThumbnailCarousel
