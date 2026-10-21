import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import useBaggageQuery from '../hooks/useBaggageQuery.js'

// Keep byte-identical with the cms2 BaggageRouteSummary block.
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}
// Pinned px sizes from Figma 40814:24308 (desktop) / 40814:23793 (mobile).
const ROUTE_SIZE = 'text-2xl leading-[normal] md:text-[40px]'
const CHIP_SIZE = 'text-xs leading-[normal] md:text-sm'
const NAME_SIZE = 'text-xs leading-[normal] md:text-sm'
/** Figma class-chip fill — default while the CMS `chipBg` token is empty. */
const DEFAULT_CHIP_BG = 'rgba(0,96,128,0.1)'

const cx = (...parts) => parts.filter(Boolean).join(' ')
const find = (options, value) => (value ? options.find((option) => option.value === value) : null)

/**
 * CMS-driven Baggage Calculator results header (Figma 40814:24308): "From → To",
 * class chip | tier card + "Cham Miles - <tier>", from `?from=&to=&class=&tier=`.
 * Hidden until Calculate unless `onlyAfterCalculate` is off. Mirrors cms2.
 */
const BaggageRouteSummary = ({
  arrowIcon = '',
  tierPrefix = '',
  anchorId = '',
  previewFrom = '',
  previewTo = '',
  previewClass = '',
  previewTier = '',
  airports = [],
  classes = [],
  tiers = [],
  onlyAfterCalculate = true,
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showClass = true,
  showTier = true,
  arrowColor = '400',
  chipBg = '',
  dividerColor = '700',
  ...textStyle
}) => {
  const query = useBaggageQuery()
  const { hash } = useLocation()
  const ref = useRef(null)
  const visible = query.calculated || !onlyAfterCalculate
  const values = query.calculated
    ? query
    : { from: previewFrom, to: previewTo, class: previewClass, tier: previewTier }

  // Calculate links to `…?from=…#results`: bring the results into view.
  useEffect(() => {
    if (!visible || !anchorId || !airports.length || hash !== `#${anchorId}`) return undefined
    const frame = requestAnimationFrame(() =>
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
    // Layout shifts (images loading in) can cut a smooth scroll short — snap
    // the rest of the way if it didn't arrive.
    const settle = setTimeout(() => {
      const top = ref.current?.getBoundingClientRect().top ?? 0
      if (top > 200 || top < 0) ref.current?.scrollIntoView({ block: 'start' })
    }, 900)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
    // airports.length: a direct load renders null until the CMS data arrives.
  }, [visible, anchorId, hash, airports.length, query.from, query.to, query.class, query.tier])

  if (!visible || !airports.length) return null

  const from = find(airports, values.from)
  const to = find(airports, values.to)
  const travelClass = showClass !== false ? find(classes, values.class) : null
  const tier = showTier !== false ? find(tiers, values.tier) : null
  const Arrow = resolvePhosphorIcon(arrowIcon || 'ArrowRight')
  const routeStyle = getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'bold')

  const inner = (
    <div id={anchorId || undefined} ref={ref} className="flex scroll-mt-28 flex-col gap-3 md:gap-2">
      <h2 className="m-0 flex flex-wrap items-center gap-2">
        <span className={cx(ROUTE_SIZE, CMS_TEXT_HOVER_CLASS)} style={routeStyle}>
          {from?.label || values.from}
        </span>
        <Arrow
          aria-hidden
          className="size-[35px] shrink-0 rtl:-scale-x-100 md:size-[55px]"
          style={{ color: colorVar(arrowColor) }}
        />
        <span className={cx(ROUTE_SIZE, CMS_TEXT_HOVER_CLASS)} style={routeStyle}>
          {to?.label || values.to}
        </span>
      </h2>
      {travelClass || tier ? (
        <div className="flex flex-wrap items-center gap-3.5">
          {travelClass ? (
            <span
              className={cx('rounded-[21px] px-2.5 py-1.5', CHIP_SIZE, CMS_TEXT_HOVER_CLASS)}
              style={{
                ...getTextStyleVars(textStyle, 'chipText', 'primary-1', 'normal'),
                backgroundColor: colorVar(chipBg) || DEFAULT_CHIP_BG,
              }}
            >
              {travelClass.label}
            </span>
          ) : null}
          {travelClass && tier ? (
            <span aria-hidden className="h-[33px] w-px" style={{ backgroundColor: colorVar(dividerColor) }} />
          ) : null}
          {tier ? (
            <span className="flex items-center gap-2.5">
              {tier.imageUrl ? (
                <img loading="lazy" decoding="async" src={tier.imageUrl} alt="" className="h-[26px] w-10 rounded-[3px] object-cover" />
              ) : null}
              <span
                className={cx(NAME_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'nameColor', 'foreground', 'normal')}
              >
                {`${tierPrefix || ''}${tier.label}`}
              </span>
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )

  const sectionClass = SECTION_PADDING[sectionPadding] || ''
  if (!sectionClass && !showSectionBg) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default BaggageRouteSummary
