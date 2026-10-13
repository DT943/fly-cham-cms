import { useCallback, useEffect, useRef, useState } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { colorVar } from '../../../styles/cmsStyle.js'

const TRACK_CLASS = {
  carousel:
    'flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth md:gap-4',
  stack:
    'flex flex-col gap-5 md:flex-row md:snap-x md:snap-mandatory md:gap-4 md:overflow-x-auto md:scroll-smooth',
}

// Figma Carousel_Arrow: 40px white circle, #e5e5e0 border, soft drop shadow,
// 18px primary chevron; centred 14.5px below the card middle on desktop.
const ARROW_CLASS =
  'absolute top-1/2 z-[1] hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-solid border-[#e5e5e0] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.06)] md:flex lg:top-[calc(50%+14.5px)]'

/**
 * Horizontal deal-card row with Figma arrows (md+) and gold dots.
 * Arrows are placed physically (left / right) and move the row the way they
 * point, so no icon is mirrored in Arabic. Dots = scroll stops (cards − visible + 1).
 */
/** Mirrors cms2 shared/deals/DealsCarousel. */
export default function DealsCarousel({
  count = 0,
  mobileLayout = 'carousel',
  showArrows = true,
  showDots = true,
  arrowColor = 'primary-1',
  dotColor = 'secondary',
  resetKey = '',
  children,
}) {
  const trackRef = useRef(null)
  const [metrics, setMetrics] = useState({ stops: 1, active: 0, canScroll: false })

  const measure = useCallback(() => {
    const el = trackRef.current
    const card = el?.querySelector('[data-deal-card]')
    if (!el || !card) {
      setMetrics({ stops: 1, active: 0, canScroll: false })
      return
    }
    const gap = parseFloat(window.getComputedStyle(el).columnGap) || 0
    const step = card.getBoundingClientRect().width + gap
    const overflow = el.scrollWidth - el.clientWidth
    const canScroll = overflow > 1 && window.getComputedStyle(el).overflowX !== 'visible'
    const visible = step ? Math.max(1, Math.round((el.clientWidth + gap) / step)) : count
    const stops = canScroll ? Math.max(1, count - visible + 1) : 1
    const offset = Math.abs(el.scrollLeft)
    const active = step ? Math.min(stops - 1, Math.round(offset / step)) : 0
    setMetrics({ stops, active, canScroll })
  }, [count])

  useEffect(() => {
    measure()
    const el = trackRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure, count])

  // A new filter selection starts the row from its first card again.
  useEffect(() => {
    const el = trackRef.current
    if (el) el.scrollTo({ left: 0, behavior: 'auto' })
    measure()
  }, [resetKey, measure])

  const stepWidth = () => {
    const el = trackRef.current
    const card = el?.querySelector('[data-deal-card]')
    if (!el || !card) return 0
    const gap = parseFloat(window.getComputedStyle(el).columnGap) || 0
    return card.getBoundingClientRect().width + gap
  }

  // `physical` -1 = toward the left edge, +1 = toward the right edge.
  const scrollPhysical = (physical) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: physical * stepWidth(), behavior: 'smooth' })
  }

  const scrollToStop = (index) => {
    const el = trackRef.current
    if (!el) return
    const rtl = window.getComputedStyle(el).direction === 'rtl'
    el.scrollTo({ left: (rtl ? -1 : 1) * index * stepWidth(), behavior: 'smooth' })
  }

  const arrowIconColor = colorVar(arrowColor || 'primary-1')
  const dotCss = colorVar(dotColor || 'secondary')

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full">
        <div
          ref={trackRef}
          onScroll={measure}
          className={`${TRACK_CLASS[mobileLayout] || TRACK_CLASS.carousel} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        >
          {children}
        </div>
        {showArrows && metrics.canScroll ? (
          <>
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollPhysical(-1)}
              className={`${ARROW_CLASS} left-[-20px]`}
            >
              <CaretLeftIcon size={18} weight="bold" aria-hidden style={{ color: arrowIconColor }} />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollPhysical(1)}
              className={`${ARROW_CLASS} right-[-19px]`}
            >
              <CaretRightIcon size={18} weight="bold" aria-hidden style={{ color: arrowIconColor }} />
            </button>
          </>
        ) : null}
      </div>
      {showDots && metrics.stops > 1 ? (
        <div className="hidden items-center gap-[10px] md:flex">
          {Array.from({ length: metrics.stops }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === metrics.active ? 'true' : undefined}
              onClick={() => scrollToStop(index)}
              className={`block shrink-0 cursor-pointer rounded-full border-0 p-0 transition-all duration-300 ${
                index === metrics.active ? 'h-[10px] w-[33px]' : 'size-3 opacity-50'
              }`}
              style={{ backgroundColor: dotCss }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
