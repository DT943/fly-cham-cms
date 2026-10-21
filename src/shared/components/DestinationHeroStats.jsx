import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons'
import {
  AirTrafficControl,
  Clock,
  CloudSun,
  Money,
  Globe,
  Buildings,
  MapPin,
  Thermometer,
  AirplaneTilt,
  CalendarBlank,
} from '@phosphor-icons/react'
import { useLocation } from 'react-router-dom'
import Container from './Container.jsx'
import { colorVar, CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../styles/cmsStyle.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import LinkedText from './backlinks/LinkedText.jsx'
import useCurrentPos from '../hooks/useCurrentPos.js'
import { destinationForPage } from './destinationHeroStats/liveStats.js'
import useLiveDestinationStats from './destinationHeroStats/useLiveDestinationStats.js'

const STAT_ICON_MAP = {
  airTrafficControl: AirTrafficControl,
  clock: Clock,
  cloudSun: CloudSun,
  money: Money,
  globe: Globe,
  buildings: Buildings,
  mapPin: MapPin,
  thermometer: Thermometer,
  airplane: AirplaneTilt,
  calendar: CalendarBlank,
}
const getStatIcon = (name) => STAT_ICON_MAP[name] || resolvePhosphorIcon(name)

const HERO_HEIGHT = {
  compact: 'h-60 sm:h-80 md:h-90 lg:h-100',
  default: 'h-70 sm:h-90 md:h-110 lg:h-125',
  tall: 'h-90 sm:h-110 md:h-125 lg:h-150',
}

const StatItem = ({ stat, iconColor, tileLabelColor, tileValueColor, metaColor, layout }) => {
  const Icon = getStatIcon(stat.icon)
  const isTile = layout === 'tile'

  return (
    <div
      className={
        isTile
          ? 'flex flex-col items-center gap-2 rounded-xl bg-100 px-3 py-4 text-center'
          : 'flex items-center gap-4 text-start'
      }
    >
      <Icon
        size={32}
        className="size-8 shrink-0"
        style={{ color: colorVar(iconColor) }}
      />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p
          className={
            isTile
              ? 'm-0 text-xs uppercase sm:text-sm'
              : 'm-0 text-sm uppercase'
          }
          style={getTextStyleVars({ tileLabelColor }, 'tileLabelColor', '600', 'normal')}
        >
          {stat.label}
        </p>
        <p
          className={isTile ? 'm-0 text-base sm:text-xl' : 'm-0 text-xl'}
          style={getTextStyleVars({ tileValueColor }, 'tileValueColor', '700', 'semibold')}
        >
          {stat.value}
        </p>
        {stat.detail ? (
          <p
            className={isTile ? 'm-0 text-xs sm:text-sm' : 'm-0 text-sm'}
            style={getTextStyleVars({ metaColor }, 'metaColor', '600', 'normal')}
          >
            {stat.detail}
          </p>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Destination guide hero + quick stats as ONE block.
 * Mobile / tablet: overlapping white sheet with 2×2 tiles.
 * Desktop (lg+): floating white card with horizontal icon + text strip.
 */
const DestinationHeroStats = ({
  // content
  title,
  country,
  image,
  imageAlt = '',
  stats: storedStats = [],
  // style
  height = 'default',
  overlayColor = 'primary-1',
  showStats = true,
  cardBg = 'white',
  iconColor = 'primary-1',
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  countryColor = '50',
  countryFontWeight = 'semibold',
  countryColorHover,
  countryFontWeightHover,
  tileLabelColor = '600',
  tileValueColor = '700',
  metaColor = '600',
  // backlinks
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const language = useCurrentLanguage()
  const isRtl = language === 'ar'
  // On a destination page (flights-to-<city>, things-to-do-in-<city>) the stats
  // are live for the visitor's POS country (its Fly Cham city; the page's own
  // city when it is in that country or the POS is Global): airport/currency from
  // the destination table, local time from its time zone, weather from
  // Open-Meteo. Switching POS changes the URL, so the stats refetch. Other pages
  // keep the CMS stats.
  const { pathname } = useLocation()
  const pos = useCurrentPos()
  const liveStats = useLiveDestinationStats(destinationForPage(pathname, pos), language)
  const stats = liveStats || storedStats
  const heightClass = HERO_HEIGHT[height] || HERO_HEIGHT.default
  const heroSrc = image
  const overlayCss = colorVar(overlayColor) || colorVar('primary-1')

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
  const countryStyleKeys = { countryColor, countryFontWeight, countryColorHover, countryFontWeightHover }
  const tileStyle = { tileLabelColor, tileValueColor, metaColor, iconColor }

  return (
    <div className="w-full">
      <section className={`relative isolate overflow-hidden ${heightClass}`}>
        {heroSrc ? (
          <img loading="lazy" decoding="async"
            src={heroSrc}
            alt={imageAlt}
            className="absolute inset-0 size-full object-cover object-[center_38%]"
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            // Figma: linear-gradient(90deg, #006080 0%, rgba(0,0,0,0) 100%)
            backgroundImage: `linear-gradient(${
              isRtl ? 270 : 90
            }deg, ${overlayCss} 0%, rgba(0, 0, 0, 0) 100%)`,
          }}
          aria-hidden
        />

        <Container className="relative flex h-full flex-col justify-center">
          <div className="flex max-w-140 flex-col gap-2 md:gap-3">
            {title ? (
              <h1
                className={`m-0 text-3xl leading-tight sm:text-4xl md:text-5xl ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h1>
            ) : null}
            {country ? (
              <p
                className={`m-0 text-base md:text-xl ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(countryStyleKeys, 'countryColor', '50', 'semibold')}
              >
                <LinkedText text={country} {...linkProps} />
              </p>
            ) : null}
          </div>
        </Container>
      </section>

      {showStats && stats.length ? (
        <>
          {/* Mobile / tablet: overlapping white sheet + 2×2 tiles */}
          <section className="relative z-10 -mt-12 rounded-t-[28px] bg-background pt-5 sm:-mt-16 sm:rounded-t-[32px] sm:pt-6 md:-mt-20 md:pt-8 lg:hidden">
            <Container>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat, index) => (
                  <StatItem key={index} stat={stat} layout="tile" {...tileStyle} />
                ))}
              </div>
            </Container>
          </section>

          {/* Desktop: floating white card — Figma: 40×20 pad, r12, shadow 0 10 30 */}
          <Container className="relative z-10 -mt-12.5 hidden lg:block">
            <div
              className="flex w-full items-start justify-between rounded-xl bg-white px-10 py-5 "
              style={
                cardBg && cardBg !== 'white'
                  ? { backgroundColor: colorVar(cardBg) }
                  : undefined
              }
            >
              {stats.map((stat, index) => (
                <StatItem key={index} stat={stat} layout="row" {...tileStyle} />
              ))}
            </div>
          </Container>
        </>
      ) : null}
    </div>
  )
}

export default DestinationHeroStats
