import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { colorVar } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

/**
 * Figma: "Our destinations" → Frame 1000004182 (node 38328:9001).
 *
 * Desktop (lg+): hover swaps eyebrow/title out while Discover + Explore CTAs
 * rise in (~500ms soft ease-out). Image zooms to 1.041.
 *
 * Mobile / tablet (< lg): always-visible layout from the mobile frame —
 * country + title at the top, Discover + Explore in a horizontal row at the
 * bottom (no hover required on touch).
 *
 * Scrim: `rgba(0,37,60,0) 38.122% → #00253C`.
 */
const swapTransition =
  'transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] motion-reduce:transition-none'

const RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-3xl',
}

const DestinationCard = ({
  iata,
  title,
  image,
  imageAlt,
  cta,
  activities,
  href = '#',
  radius = 'lg',
  iataColor = '100',
  titleColor = '100',
  buttonBg = 'primary-1',
  buttonTextColor = '100',
  activitiesColor = '50',
  // Optional Normal/Hover button styling from getButtonStyle (CMS block).
  buttonClassName,
  buttonStyle,
}) => {
  const radiusClass = RADIUS_CLASS[radius] ?? RADIUS_CLASS.lg
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = hovered || focused

  const buttonProps = {
    className: `${typography.caption} rounded-lg p-2.5 text-center font-semibold no-underline transition-[opacity,colors] duration-200 ease-out motion-reduce:transition-none ${
      buttonStyle ? buttonClassName || '' : 'hover:opacity-90'
    }`,
    style:
      buttonStyle || {
        color: colorVar(buttonTextColor),
        backgroundColor: colorVar(buttonBg),
      },
  }

  const activitiesClass = `${typography.caption} inline-flex items-center gap-2.5 rounded-lg font-medium no-underline transition-transform duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0`

  return (
    <article
      className={`relative overflow-hidden ${radiusClass} aspect-[282/176] cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false)
        }
      }}
    >
      <img
        src={image}
        alt={imageAlt}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] motion-reduce:transition-none lg:transition-transform ${
          active ? 'lg:scale-[1.041]' : 'scale-100'
        }`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,37,60,0)_38.122%,#00253C_100%)]"
      />

      {/* Mobile: title top + CTAs row bottom — always visible */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 lg:hidden">
        <div className="flex flex-col gap-1 pointer-events-none">
          <p
            className={`${typography.caption} m-0 font-semibold`}
            style={{ color: colorVar(iataColor) }}
          >
            {iata}
          </p>
          <p
            className={`${typography.body} m-0 font-medium`}
            style={{ color: colorVar(titleColor) }}
          >
            {title}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2.5">
          <LocalizedLink href={href} {...buttonProps} className={`${buttonProps.className} shrink-0`}>
            {cta}
          </LocalizedLink>
          <LocalizedLink
            href={href}
            className={`${activitiesClass} min-w-0 justify-center`}
            style={{ color: colorVar(activitiesColor) }}
          >
            <span className="truncate">{activities}</span>
            <span className="flex size-[29px] shrink-0 items-center justify-center">
              <ArrowRight size={20} className="rtl:-scale-x-100" />
            </span>
          </LocalizedLink>
        </div>
      </div>

      {/* Desktop: hover swap (Figma Property 1=Default → Variant2) */}
      <div className="absolute inset-x-0 bottom-0 hidden p-4 lg:grid">
        <div
          className={`col-start-1 row-start-1 flex flex-col gap-1 self-end pointer-events-none ${swapTransition} ${
            active
              ? 'opacity-0 -translate-y-full motion-reduce:translate-y-0'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <p
            className={`${typography.caption} m-0 font-semibold`}
            style={{ color: colorVar(iataColor) }}
          >
            {iata}
          </p>
          <p
            className={`${typography.body} m-0 font-medium`}
            style={{ color: colorVar(titleColor) }}
          >
            {title}
          </p>
        </div>

        <div
          className={`col-start-1 row-start-1 flex flex-col gap-2 self-end ${swapTransition} ${
            active
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-full opacity-0 motion-reduce:translate-y-0'
          }`}
        >
          <LocalizedLink href={href} {...buttonProps}>
            {cta}
          </LocalizedLink>
          <LocalizedLink
            href={href}
            className={`${activitiesClass} justify-center`}
            style={{ color: colorVar(activitiesColor) }}
          >
            {activities}
            <span className="flex size-[29px] shrink-0 items-center justify-center">
              <ArrowRight size={20} className="rtl:-scale-x-100" />
            </span>
          </LocalizedLink>
        </div>
      </div>
    </article>
  )
}

export default DestinationCard
