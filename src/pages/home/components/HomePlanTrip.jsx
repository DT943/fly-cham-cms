import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { homeTripDestinations } from '../utils/homeTripDestinations.js'
import HomeTripCard from './HomeTripCard.jsx'

const getVisibleCount = (width) => {
  if (width >= 1024) return 4
  if (width >= 768) return 3
  if (width >= 640) return 2
  return 1
}

const getGap = (width) => (width >= 768 ? 20 : 16)

/**
 * "Plan Your Trip With Us" — transform-based destination slider (smooth arrow nav).
 */
const HomePlanTrip = () => {
  const { t, i18n } = useTranslation()
  const viewportRef = useRef(null)
  const dragRef = useRef({ active: false, startX: 0, lastX: 0 })
  const [index, setIndex] = useState(0)
  const [layout, setLayout] = useState({ cardWidth: 0, gap: 16, visible: 1 })
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const isRtl = i18n.dir() === 'rtl'
  const total = homeTripDestinations.length
  const maxIndex = Math.max(0, total - layout.visible)

  const measure = useCallback(() => {
    const el = viewportRef.current
    if (!el) return

    const width = el.clientWidth
    const visible = getVisibleCount(width)
    const gap = getGap(width)
    const cardWidth = Math.max(0, (width - gap * (visible - 1)) / visible)

    setLayout({ cardWidth, gap, visible })
    setIndex((current) => Math.min(current, Math.max(0, total - visible)))
  }, [total])

  useEffect(() => {
    measure()
    const el = viewportRef.current
    if (!el || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  const go = useCallback(
    (direction) => {
      setIndex((current) => Math.max(0, Math.min(maxIndex, current + direction)))
    },
    [maxIndex],
  )

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse') return
    dragRef.current = { active: true, startX: event.clientX, lastX: event.clientX }
    setIsDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!dragRef.current.active) return
    const delta = event.clientX - dragRef.current.startX
    dragRef.current.lastX = event.clientX
    setDragOffset(delta)
  }

  const onPointerUp = () => {
    if (!dragRef.current.active) return
    const delta = dragRef.current.lastX - dragRef.current.startX
    dragRef.current.active = false
    setIsDragging(false)
    setDragOffset(0)

    const threshold = Math.min(72, layout.cardWidth * 0.2)
    if (Math.abs(delta) < threshold) return

    const forward = isRtl ? delta > 0 : delta < 0
    go(forward ? 1 : -1)
  }

  const offset = layout.cardWidth > 0 ? index * (layout.cardWidth + layout.gap) : 0
  const baseTranslate = isRtl ? offset : -offset
  const translateX = baseTranslate + (isDragging ? dragOffset : 0)

  return (
    <section className="w-full min-w-0 bg-100 pt-6 pb-10 md:pt-8 md:pb-12">
      <Container className="flex min-w-0 flex-col gap-5 md:gap-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="flex max-w-xl flex-col gap-1.5 md:gap-2">
            <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[32px]`}>
              {t('home.planTrip.title')}
            </h2>
            <p className={`m-0 font-normal text-600 ${typography.sectionDescription}`}>
              {t('home.planTrip.subtitle')}
            </p>
          </div>
          <LocalizedLink
            href="/our-destinations"
            className={`inline-flex shrink-0 items-center gap-1 font-semibold text-primary-1 no-underline hover:underline ${typography.caption}`}
          >
            {t('home.planTrip.viewAll')}
            <CaretRight size={14} weight="bold" className="rtl:-scale-x-100" />
          </LocalizedLink>
        </div>

        <div className="relative min-w-0">
          <div
            ref={viewportRef}
            className="min-w-0 touch-pan-y overflow-hidden"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div
              className="flex will-change-transform"
              style={{
                gap: `${layout.gap}px`,
                transform: `translate3d(${translateX}px, 0, 0)`,
                transition: isDragging
                  ? 'none'
                  : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {homeTripDestinations.map((destination) => (
                <div
                  key={destination.id}
                  data-trip-card
                  className="shrink-0 grow-0"
                  style={{
                    width: layout.cardWidth ? `${layout.cardWidth}px` : undefined,
                    flexBasis: layout.cardWidth ? `${layout.cardWidth}px` : undefined,
                  }}
                >
                  <HomeTripCard {...destination} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index <= 0}
            aria-label={t('home.planTrip.prev')}
            className="absolute inset-s-0 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-200 bg-50 text-600 shadow-[0_2px_10px_rgba(33,37,41,0.12)] transition-opacity hover:text-primary-1 disabled:pointer-events-none disabled:opacity-40 md:grid rtl:translate-x-1/2"
          >
            <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index >= maxIndex}
            aria-label={t('home.planTrip.next')}
            className="absolute inset-e-0 top-1/2 z-10 hidden size-9 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-200 bg-50 text-600 shadow-[0_2px_10px_rgba(33,37,41,0.12)] transition-opacity hover:text-primary-1 disabled:pointer-events-none disabled:opacity-40 md:grid rtl:-translate-x-1/2"
          >
            <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
          </button>
        </div>
      </Container>
    </section>
  )
}

export default HomePlanTrip
