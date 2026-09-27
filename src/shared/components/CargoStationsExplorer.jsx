import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AirplaneTilt, MapPin, CaretLeft, CaretRight } from '@phosphor-icons/react'
import Container from './Container.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import bandImage from '../../assets/images-webp/cargo-stations/band.webp'
import stationDamascus from '../../assets/images-webp/cargo-stations/station-damascus.webp'
import stationAleppo from '../../assets/images-webp/cargo-stations/station-aleppo.webp'
import station1 from '../../assets/images-webp/cargo-stations/station-1.webp'
import station2 from '../../assets/images-webp/cargo-stations/station-2.webp'
import station3 from '../../assets/images-webp/cargo-stations/station-3.webp'
import station4 from '../../assets/images-webp/cargo-stations/station-4.webp'

/** Bundled fallback images keyed by station id (used when the CMS image is empty). */
const IMAGE_BY_ID = {
  damascus: stationDamascus,
  aleppo: stationAleppo,
  dubai: station2,
  sharjah: station3,
  baghdad: station4,
  erbil: station1,
  beirut: station2,
}

/** Figma scrollbar track — no theme token matches it exactly. */
const SCROLL_TRACK_FALLBACK_COLOR = '#D9D9D9'

const HEADER_PADDING_TOP = {
  none: '',
  default: 'pt-8 md:pt-14',
}

const TITLE_SIZE = 'text-4xl sm:text-5xl lg:text-[64px]'
const SUBTITLE_SIZE = 'text-sm sm:text-base lg:text-[16px]'
const PANEL_TITLE_SIZE = 'text-base md:text-lg lg:text-[18px]'
const NAME_SIZE = 'text-[14px]'
const LOCATION_SIZE = 'text-[11px]'
const LH_NORMAL = { lineHeight: 'normal' }

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** Theme token → CSS color ('white' is a literal; '' → fallback token). */
const tokenCss = (token, fallback) => {
  const value = token || fallback
  if (value === 'white') return '#ffffff'
  return colorVar(value)
}

const bgFocusToObjectPosition = (focus) => {
  const n = Number(focus)
  const pct = Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : 40
  return `center ${pct}%`
}

const clampListHeight = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return 264
  return Math.min(640, Math.max(120, Math.round(n)))
}

const StationCard = ({ station, cardBg, cardBorderColor, stationIconColor, textStyle }) => {
  const src = station.image || IMAGE_BY_ID[station.id] || station1

  return (
    <article
      className="flex shrink-0 snap-start items-center gap-3 rounded-[12px] border border-solid p-[11px] sm:gap-4"
      style={{
        backgroundColor: tokenCss(cardBg, '50'),
        borderColor: tokenCss(cardBorderColor, '200'),
      }}
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-[8px] lg:size-[100px]">
        <img
          src={src}
          alt={station.imageAlt || ''}
          width={100}
          height={100}
          decoding="async"
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <div className="flex items-center gap-[6px]">
          <AirplaneTilt
            size={16}
            className="shrink-0"
            style={{ color: tokenCss(stationIconColor, 'primary-1') }}
          />
          <h3
            className={cx('m-0', NAME_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={{
              ...getTextStyleVars(textStyle, 'nameColor', 'primary-1', 'semibold'),
              ...LH_NORMAL,
            }}
          >
            {station.name}
          </h3>
        </div>
        {station.location ? (
          <div
            className="flex items-center gap-1"
            style={{ color: tokenCss(textStyle.metaColor, '600') }}
          >
            <MapPin size={16} className="shrink-0" />
            <p
              className={cx('m-0', LOCATION_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={{
                ...getTextStyleVars(textStyle, 'metaColor', '600', 'medium'),
                ...LH_NORMAL,
              }}
            >
              {station.location}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  )
}

/** Below lg: one-at-a-time horizontal carousel with arrows + progress. */
const StationsCarousel = ({ stations, accent, cardProps }) => {
  const { t, i18n } = useTranslation()
  const trackRef = useRef(null)
  const slideRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideStep, setSlideStep] = useState(0)
  const maxIndex = Math.max(0, stations.length - 1)
  const current = Math.min(activeIndex, maxIndex)
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
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureSlideStep) : null
    if (ro && trackRef.current) ro.observe(trackRef.current)
    return () => {
      window.removeEventListener('resize', measureSlideStep)
      ro?.disconnect()
    }
  }, [measureSlideStep])

  const progress = ((current + 1) / stations.length) * 100
  const goTo = (index) => setActiveIndex(Math.min(Math.max(index, 0), maxIndex))

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="min-w-0 overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-3 transition-transform duration-300 ease-out will-change-transform"
          style={{
            transform: `translate3d(${isRtl ? '' : '-'}${current * slideStep}px, 0, 0)`,
          }}
        >
          {stations.map((station, index) => (
            <div
              key={station.id || index}
              ref={index === 0 ? slideRef : null}
              className="w-[calc(100%-1.25rem)] shrink-0 grow-0 basis-[calc(100%-1.25rem)]"
            >
              <StationCard station={station} {...cardProps} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          aria-label={t('cargoStations.stations.prev')}
          className="grid size-9 place-items-center rounded-full border-0 bg-primary-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          style={{ color: accent }}
        >
          <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
        </button>
        <button
          type="button"
          onClick={() => goTo(current + 1)}
          disabled={current >= maxIndex}
          aria-label={t('cargoStations.stations.next')}
          className="grid size-9 place-items-center rounded-full border-0 text-50 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: accent }}
        >
          <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </button>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-200">
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  )
}

/** lg+: fixed-height vertical list with a custom pill scrollbar. */
const StationsScrollList = ({ stations, listHeight, trackColor, thumbColor, cardProps }) => {
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
  }, [updateThumb, stations.length, listHeight])

  // Interactive scrollbar: drag the thumb or click the track to scroll the list.
  const trackRef = useRef(null)
  const dragRef = useRef(null)
  const scrollToPointer = useCallback((clientY, grabOffset) => {
    const el = listRef.current
    const track = trackRef.current
    if (!el || !track) return
    const rect = track.getBoundingClientRect()
    const thumbPx = (thumb.heightPct / 100) * rect.height
    const travel = rect.height - thumbPx
    if (travel <= 0) return
    const ratio = Math.min(Math.max((clientY - rect.top - grabOffset) / travel, 0), 1)
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight)
  }, [thumb.heightPct])
  const onTrackPointerDown = (event) => {
    const track = trackRef.current
    if (!track) return
    event.preventDefault()
    const rect = track.getBoundingClientRect()
    const thumbPx = (thumb.heightPct / 100) * rect.height
    const thumbTop = (thumb.offsetPct / 100) * rect.height
    const y = event.clientY - rect.top
    // Grabbing the thumb keeps the grab point; clicking the track centres the thumb there.
    const grabOffset = y >= thumbTop && y <= thumbTop + thumbPx ? y - thumbTop : thumbPx / 2
    dragRef.current = grabOffset
    track.setPointerCapture?.(event.pointerId)
    const el = listRef.current
    if (el) el.style.scrollSnapType = 'none'
    scrollToPointer(event.clientY, grabOffset)
  }
  const onTrackPointerMove = (event) => {
    if (dragRef.current == null) return
    scrollToPointer(event.clientY, dragRef.current)
  }
  const onTrackPointerUp = () => {
    dragRef.current = null
    const el = listRef.current
    if (el) el.style.scrollSnapType = ''
  }

  return (
    <div className="hidden min-w-0 gap-4 lg:flex">
      <div
        ref={listRef}
        className="no-scrollbar flex min-w-0 flex-1 snap-y snap-mandatory flex-col gap-4 overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ height: `${listHeight}px` }}
      >
        {stations.map((station, index) => (
          <StationCard key={station.id || index} station={station} {...cardProps} />
        ))}
      </div>

      {thumb.needed ? (
        <div
          ref={trackRef}
          role="scrollbar"
          aria-orientation="vertical"
          aria-valuenow={Math.round(thumb.offsetPct)}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={onTrackPointerUp}
          onPointerCancel={onTrackPointerUp}
          className="relative w-[5px] shrink-0 cursor-pointer touch-none overflow-hidden rounded-[30px]"
          style={{ height: `${listHeight}px`, backgroundColor: trackColor }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 rounded-[30px]"
            style={{
              height: `${thumb.heightPct}%`,
              top: `${thumb.offsetPct}%`,
              backgroundColor: thumbColor,
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

/**
 * CMS-driven Cargo Stations explorer (cargo-stations-explorer). Page header,
 * then a FULL-BLEED photo band (black wash) holding a white stations panel:
 * lg+ fixed-height vertical list + custom scrollbar; below lg a one-at-a-time
 * carousel. Mirrors flychamadmin cms2 CargoStationsExplorerPanel; defaults =
 * Figma tokens. Full-bleed: renders its own section + Containers.
 */
const CargoStationsExplorer = ({
  title = '',
  subtitle = '',
  bgImage,
  bgAlt = '',
  panelTitle = '',
  stations = [],
  headerPaddingTop = 'default',
  overlayOpacity = 20,
  bgFocus = 40,
  panelBg = 'white',
  listHeight = 264,
  cardBg = '50',
  cardBorderColor = '200',
  stationIconColor = 'primary-1',
  scrollTrackColor = '',
  scrollThumbColor = 'primary-1',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const headerPadClass = HEADER_PADDING_TOP[headerPaddingTop] ?? HEADER_PADDING_TOP.default
  const overlay = Math.min(100, Math.max(0, Number(overlayOpacity) || 0))
  const accent = tokenCss(scrollThumbColor, 'primary-1')
  const trackColor = scrollTrackColor ? tokenCss(scrollTrackColor, '300') : SCROLL_TRACK_FALLBACK_COLOR
  const height = clampListHeight(listHeight)
  const cardProps = { cardBg, cardBorderColor, stationIconColor, textStyle }

  if (!title && !subtitle && !panelTitle && !stations.length) return null

  return (
    <section className="w-full min-w-0">
      {title || subtitle ? (
        <Container
          className={cx(
            'flex min-w-0 flex-col gap-2 pb-8 md:gap-3 md:pb-10 lg:gap-4 lg:pb-[60px]',
            headerPadClass,
          )}
        >
          {title ? (
            <h1
              className={cx('m-0 capitalize', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={{
                ...getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'bold'),
                ...LH_NORMAL,
              }}
            >
              <LinkedText text={title} {...linkProps} />
            </h1>
          ) : null}
          {subtitle ? (
            <p
              className={cx('m-0', SUBTITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={{
                ...getTextStyleVars(textStyle, 'subtitleColor', '700', 'normal'),
                ...LH_NORMAL,
              }}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </Container>
      ) : null}

      <div className="relative isolate min-h-[480px] w-full overflow-hidden md:min-h-[560px] lg:h-[762px] lg:min-h-0">
        <img
          src={bgImage || bandImage}
          alt={bgAlt}
          style={{ objectPosition: bgFocusToObjectPosition(bgFocus) }}
          className="absolute inset-0 size-full object-cover"
        />
        {overlay > 0 ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: `rgba(0, 0, 0, ${overlay / 100})` }}
            aria-hidden="true"
          />
        ) : null}

        <Container className="relative z-10 flex min-h-[480px] items-center py-8 md:min-h-[560px] md:py-10 lg:h-full lg:min-h-0 lg:items-start lg:pb-0 lg:pt-[131px]">
          <div
            className="flex w-full max-w-md flex-col gap-4 rounded-[16px] p-4 sm:p-5 lg:ms-[27px] lg:w-[500px] lg:max-w-full lg:p-6"
            style={{ backgroundColor: tokenCss(panelBg, 'white') }}
          >
            {panelTitle ? (
              <h2
                className={cx('m-0', PANEL_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={{
                  ...getTextStyleVars(textStyle, 'headingColor', '700', 'semibold'),
                  ...LH_NORMAL,
                }}
              >
                {panelTitle}
              </h2>
            ) : null}

            {stations.length ? (
              <>
                <div className="lg:hidden">
                  <StationsCarousel stations={stations} accent={accent} cardProps={cardProps} />
                </div>
                <StationsScrollList
                  stations={stations}
                  listHeight={height}
                  trackColor={trackColor}
                  thumbColor={accent}
                  cardProps={cardProps}
                />
              </>
            ) : null}
          </div>
        </Container>
      </div>
    </section>
  )
}

export default CargoStationsExplorer
