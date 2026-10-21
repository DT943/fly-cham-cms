import { useState } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { colorVar } from '../../../styles/cmsStyle.js'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

/**
 * Figma: Frame 1000004182 (38313:3792).
 * Prototype: On hover → Property 1=Variant2, smart animate, ease out, 500ms.
 *
 * Desktop (lg+): the bottom stack stays pinned. Country + title fade while
 * the clipped Discover + Explore block expands into view. Image scales to
 * 1.041 from center (294×183 over 282×176).
 *
 * Mobile (< lg): Figma our-destinations-mobile card (358×179). Country and
 * title stay at the top; Discover and Explore sit in one row at the bottom.
 *
 * Scrim: `rgba(0,37,60,0) 38.122% → #00253C`.
 */
const hoverMotion = 'duration-500 ease-out motion-reduce:transition-none'

const RADIUS_CLASS = {
  none: 'rounded-none',
  sm: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-3xl',
}

const DestinationCard = ({
  country,
  iata,
  title,
  image,
  imageAlt,
  cta,
  activities,
  href = '#',
  // "Things to Do" link; falls back to the card link when not set.
  activitiesHref,
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
  const thingsToDoHref = activitiesHref || href
  const place = country || iata
  const radiusClass = RADIUS_CLASS[radius] ?? RADIUS_CLASS.lg
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = hovered || focused

  const buttonProps = {
    className: `rounded-lg p-2.5 text-center no-underline ${buttonClassName || ''}`,
    style:
      buttonStyle || {
        color: colorVar(buttonTextColor),
        backgroundColor: colorVar(buttonBg),
      },
  }

  const activitiesClass = `${typography.caption} inline-flex items-center gap-2.5 rounded-lg font-medium no-underline transition-transform duration-200 hover:translate-x-1 rtl:hover:-translate-x-1 motion-reduce:transition-none motion-reduce:hover:translate-x-0`

  return (
    <article
      className={`relative overflow-hidden ${radiusClass} h-[179px] cursor-pointer lg:h-auto lg:aspect-[282/176]`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false)
        }
      }}
    >
      {image ? (
        <img loading="lazy" decoding="async"
          src={image}
          alt={imageAlt}
          className={`absolute inset-0 h-full w-full object-cover transition-transform ${hoverMotion} ${
            active ? 'lg:scale-[1.041]' : 'scale-100'
          }`}
        />
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,37,60,0)_38.122%,#00253C_100%)]"
      />

      {/* Mobile: title top + CTAs row bottom — always visible */}
      <div className="absolute inset-0 flex flex-col justify-between p-3.5 lg:hidden">
        <div className="flex flex-col gap-1 pointer-events-none">
          <p className="m-0 text-xs font-semibold" style={{ color: colorVar(iataColor) }}>
            {place}
          </p>
          <p className="m-0 text-sm font-medium" style={{ color: colorVar(titleColor) }}>
            {title}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <LocalizedLink href={href} {...buttonProps} className={`${buttonProps.className} shrink-0 text-sm font-medium`}>
            {cta}
          </LocalizedLink>
          <LocalizedLink
            href={thingsToDoHref}
            className="inline-flex min-w-0 items-center justify-center gap-2.5 rounded-lg text-sm font-medium no-underline"
            style={{ color: colorVar(activitiesColor) }}
          >
            <span className="truncate">{activities}</span>
            <span className="flex size-[29px] shrink-0 items-center justify-center">
              <ArrowRight size={20} className="rtl:-scale-x-100" />
            </span>
          </LocalizedLink>
        </div>
      </div>

      {/* Desktop: prototype smart-animate (Default → Variant2) */}
      <div className="absolute inset-x-0 bottom-0 hidden flex-col p-4 lg:flex">
        <div
          className={`flex flex-col gap-1 pointer-events-none transition-opacity ${hoverMotion} ${
            active ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <p
            className={`${typography.caption} m-0 font-semibold`}
            style={{ color: colorVar(iataColor) }}
          >
            {place}
          </p>
          <p
            className={`${typography.body} m-0 font-medium`}
            style={{ color: colorVar(titleColor) }}
          >
            {title}
          </p>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] ${hoverMotion} ${
            active
              ? 'mt-3 grid-rows-[1fr] opacity-100'
              : 'mt-0 grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className={`flex min-h-0 flex-col gap-2 overflow-hidden ${active ? '' : 'pointer-events-none'}`}>
            <LocalizedLink href={href} {...buttonProps} className={`${buttonProps.className} ${typography.caption} font-semibold`}>
              {cta}
            </LocalizedLink>
            <LocalizedLink
              href={thingsToDoHref}
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
      </div>
    </article>
  )
}

export default DestinationCard
