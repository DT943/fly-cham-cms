import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { colorVar } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

/**
 * Figma: "Our destinations" → Frame 1000004182 (node 38328:9001).
 *
 * Hover swaps the two content blocks in place (Figma `Property 1=Default` →
 * `Property 1=Variant2`): eyebrow/title rise out while Discover + Explore CTAs
 * rise in. Timing matches the Figma prototype, which is slower and softer than
 * a standard swap — ~500ms on a soft ease-out, not 300ms on the
 * cubic-bezier(0.4, 0, 0.2, 1) standard curve.
 *
 * Image zoom is Figma's, too: the hover variant draws the photo at 294 × 183
 * over a 282.33 × 175.75 card = scale 1.041, centred. The old 1.1 read as a
 * lurch at this card size. Scrim is fixed: `rgba(0,37,60,0) 38.122% → #00253C`.
 *
 * Hover is React-state driven (same as cms2) so both apps match and stay
 * reliable inside nested layouts. Colors + corners stay prop-driven.
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
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] motion-reduce:transition-none ${
          active ? 'scale-[1.041]' : 'scale-100'
        }`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,37,60,0)_38.122%,#00253C_100%)]"
      />

      {/* Both blocks share one grid cell and sit bottom-aligned, so they cross in place. */}
      <div className="absolute inset-x-0 bottom-0 grid p-4">
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
          <LocalizedLink
            href={href}
            className={`${typography.caption} rounded-lg p-2.5 text-center font-semibold no-underline transition-[opacity,colors] duration-200 ease-out motion-reduce:transition-none ${
              buttonStyle ? buttonClassName || '' : 'hover:opacity-90'
            }`}
            style={
              buttonStyle || {
                color: colorVar(buttonTextColor),
                backgroundColor: colorVar(buttonBg),
              }
            }
          >
            {cta}
          </LocalizedLink>
          <LocalizedLink
            href={href}
            className={`${typography.caption} inline-flex items-center justify-center gap-2.5 rounded-lg font-medium no-underline transition-transform duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0`}
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
