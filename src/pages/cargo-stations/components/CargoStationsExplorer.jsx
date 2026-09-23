import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AirplaneTilt, MapPin, CaretLeft, CaretRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'
import { cargoStationsHero, cargoStationsList } from '../utils/cargoStationsContent.js'

const StationRow = ({ id, image, className = '' }) => {
  const { t } = useTranslation()

  return (
    <article
      className={`flex items-start gap-3 rounded-xl border border-200 bg-50 p-2.5 sm:gap-4 sm:p-3 ${className}`}
    >
      <div className="size-14 shrink-0 overflow-hidden rounded-lg sm:size-16">
        <img
          src={image}
          alt={t(`cargoStations.stations.items.${id}.imageAlt`)}
          width={64}
          height={64}
          decoding="async"
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start gap-1.5 text-primary-1">
          <AirplaneTilt size={16} className="mt-0.5 shrink-0" />
          <h3 className={`m-0 font-semibold leading-snug ${typography.caption}`}>
            {t(`cargoStations.stations.items.${id}.name`)}
          </h3>
        </div>
        <div className="flex items-start gap-1.5 text-600">
          <MapPin size={14} weight="regular" className="mt-0.5 shrink-0" />
          <p className={`m-0 ${typography.caption}`}>
            {t(`cargoStations.stations.items.${id}.location`)}
          </p>
        </div>
      </div>
    </article>
  )
}

/** Mobile: one-at-a-time horizontal carousel with arrows + progress. */
const StationsCarousel = () => {
  const { t, i18n } = useTranslation()
  const trackRef = useRef(null)
  const slideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideStep, setSlideStep] = useState(0)
  const maxIndex = Math.max(0, cargoStationsList.length - 1)
  const isRtl = i18n.dir() === 'rtl'

  const measureSlideStep = useCallback(() => {
    const slide = slideRef.current
    const track = trackRef.current
    if (!slide || !track) return
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || '12') || 12
    setSlideStep(slide.offsetWidth + gap)
  }, [])

  useEffect(() => {
    measureSlideStep()
    window.addEventListener('resize', measureSlideStep)
    return () => window.removeEventListener('resize', measureSlideStep)
  }, [measureSlideStep])

  const progress = ((activeIndex + 1) / cargoStationsList.length) * 100

  const goTo = (index) => {
    setActiveIndex(Math.min(Math.max(index, 0), maxIndex))
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="min-w-0 overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-3 transition-transform duration-300 ease-out will-change-transform"
          style={{
            transform: `translate3d(${isRtl ? '' : '-'}${activeIndex * slideStep}px, 0, 0)`,
          }}
        >
          {cargoStationsList.map((station, index) => (
            <div
              key={station.id}
              ref={index === 0 ? slideRef : null}
              className="w-[calc(100%-1.25rem)] shrink-0 grow-0 basis-[calc(100%-1.25rem)]"
            >
              <StationRow {...station} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label={t('cargoStations.stations.prev')}
          className="grid size-9 place-items-center rounded-full border-0 bg-primary-100 text-primary-1 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
        </button>
        <button
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          disabled={activeIndex >= maxIndex}
          aria-label={t('cargoStations.stations.next')}
          className="grid size-9 place-items-center rounded-full border-0 bg-primary-1 text-50 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </button>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-200">
        <div
          className="h-full rounded-full bg-primary-1 transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

/** Desktop: vertical list with custom pill-style scroll indicator. */
const StationsScrollList = ({ listId }) => {
  const listRef = useRef(null)
  const [thumb, setThumb] = useState({ heightPct: 100, offsetPct: 0, needed: false })

  const updateThumb = useCallback(() => {
    const el = listRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const needed = scrollHeight > clientHeight + 1
    if (!needed) {
      setThumb({ heightPct: 100, offsetPct: 0, needed: false })
      return
    }

    const heightPct = Math.max((clientHeight / scrollHeight) * 100, 18)
    const maxOffset = 100 - heightPct
    const scrollable = scrollHeight - clientHeight
    const offsetPct = scrollable > 0 ? (scrollTop / scrollable) * maxOffset : 0

    setThumb({ heightPct, offsetPct, needed: true })
  }, [])

  useEffect(() => {
    updateThumb()
    const el = listRef.current
    if (!el) return undefined

    el.addEventListener('scroll', updateThumb, { passive: true })
    window.addEventListener('resize', updateThumb)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateThumb) : null
    ro?.observe(el)

    return () => {
      el.removeEventListener('scroll', updateThumb)
      window.removeEventListener('resize', updateThumb)
      ro?.disconnect()
    }
  }, [updateThumb])

  return (
    <div className="hidden min-w-0 gap-3 lg:flex">
      <div
        id={listId}
        ref={listRef}
        className="no-scrollbar flex max-h-48 min-w-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] sm:max-h-50"
      >
        {cargoStationsList.map((station) => (
          <StationRow key={station.id} {...station} />
        ))}
      </div>

      {thumb.needed ? (
        <div
          className="relative w-1.5 shrink-0 self-stretch overflow-hidden rounded-full bg-200"
          aria-hidden="true"
        >
          <div
            className="absolute inset-x-0 rounded-full bg-primary-1 transition-[top,height] duration-150 ease-out"
            style={{
              height: `${thumb.heightPct}%`,
              top: `${thumb.offsetPct}%`,
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

/**
 * Title band + full-bleed photo banner.
 * Mobile: horizontal station carousel. Desktop: compact vertical scroll list.
 */
const CargoStationsExplorer = () => {
  const { t } = useTranslation()
  const listId = useId()

  return (
    <section className="w-full min-w-0">
      <div className="">
        <Container className="flex min-w-0 flex-col gap-2 py-8 md:gap-3 md:py-10">
          <h1 className={`m-0 font-bold text-primary-1 ${typography.pageTitle} lg:text-[48px]`}>
            {t('cargoStations.hero.title')}
          </h1>
          <p className={`m-0 max-w-2xl font-normal leading-relaxed text-600 ${typography.sectionDescription}`}>
            {t('cargoStations.hero.subtitle')}
          </p>
        </Container>
      </div>

      <div className="relative isolate min-h-105 w-full overflow-hidden md:min-h-110 lg:min-h-125">
        <img
          src={cargoStationsHero.image}
          alt={t('cargoStations.hero.imageAlt')}
          style={{ objectPosition: cargoStationsHero.objectPosition }}
          className="absolute inset-0 size-full object-cover"
        />

        <Container className="relative z-10 flex min-h-115 items-center py-8 md:min-h-120 md:py-10 lg:min-h-145">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-50 p-4 shadow-[0_8px_32px_rgba(1,38,59,0.16)] sm:p-5 lg:max-w-sm">
            <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} md:text-xl`}>
              {t('cargoStations.stations.title')}
            </h2>

            <div className="lg:hidden">
              <StationsCarousel />
            </div>

            <StationsScrollList listId={listId} />
          </div>
        </Container>
      </div>
    </section>
  )
}

export default CargoStationsExplorer
