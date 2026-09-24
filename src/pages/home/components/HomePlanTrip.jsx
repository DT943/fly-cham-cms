import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { homeTripDestinations } from '../utils/homeTripDestinations.js'
import HomeTripCard from './HomeTripCard.jsx'

/**
 * "Plan Your Trip With Us" — horizontal destination card slider.
 */
const HomePlanTrip = () => {
  const { t, i18n } = useTranslation()
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const isRtl = i18n.dir() === 'rtl'

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const left = Math.abs(el.scrollLeft)
    setCanPrev(left > 8)
    setCanNext(left < max - 8)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollByCard = (direction) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('[data-trip-card]')
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.7
    const delta = direction * step * (isRtl ? -1 : 1)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

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
            ref={trackRef}
            className="no-scrollbar flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [-webkit-overflow-scrolling:touch] md:gap-5"
          >
            {homeTripDestinations.map((destination) => (
              <div
                key={destination.id}
                data-trip-card
                className="w-[min(78%,17rem)] shrink-0 grow-0 basis-[min(78%,17rem)] sm:w-[calc((100%-1rem)/2)] sm:basis-[calc((100%-1rem)/2)] md:w-[calc((100%-2.5rem)/3)] md:basis-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)] lg:basis-[calc((100%-3.75rem)/4)]"
              >
                <HomeTripCard {...destination} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label={t('home.planTrip.prev')}
            className="absolute start-0 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-200 bg-50 text-600 shadow-[0_2px_10px_rgba(33,37,41,0.12)] transition-opacity hover:text-primary-1 disabled:opacity-40 md:grid rtl:translate-x-1/2"
          >
            <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label={t('home.planTrip.next')}
            className="absolute end-0 top-1/2 z-10 hidden size-9 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-200 bg-50 text-600 shadow-[0_2px_10px_rgba(33,37,41,0.12)] transition-opacity hover:text-primary-1 disabled:opacity-40 md:grid rtl:-translate-x-1/2"
          >
            <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
          </button>
        </div>
      </Container>
    </section>
  )
}

export default HomePlanTrip
