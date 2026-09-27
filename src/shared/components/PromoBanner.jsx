import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../styles/typography.js'
import { colorVar, CMS_TEXT_HOVER_CLASS, getButtonStyle, getTextStyleVars } from '../../styles/cmsStyle.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** Mirror cms2's PromoBanner token maps so the CMS preview and the public
 * render stay pixel-identical. */
const BANNER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const BANNER_HEIGHT = {
  compact: 'min-h-[180px] sm:min-h-[200px] md:min-h-[220px]',
  default: 'min-h-[200px] sm:min-h-[240px] md:min-h-[280px]',
  // Figma Cargo Guide banner: 360px tall on desktop.
  medium: 'min-h-[240px] sm:min-h-[300px] md:min-h-[360px]',
  tall: 'min-h-[260px] sm:min-h-[320px] md:min-h-[380px]',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

/**
 * Full-bleed image banner with a CTA. Defaults reproduce the static Contact Us
 * / Our GSA design; the CMS can override colours, height, radius, padding,
 * visibility flags, per-role hover, and backlinks.
 *
 * Figma wash (when showOverlay): opacity 0.9 + navy→transparent gradient +
 * blur(23.10px), clipped by the banner radius.
 */
const PromoBanner = ({
  title,
  description,
  cta,
  href = '#',
  image,
  imageAlt,
  showTitle = true,
  showDescription = true,
  showButton = true,
  showSectionBg = false,
  showOverlay = true,
  sectionBg = '100',
  sectionPadding = 'none',
  bannerHeight = 'default',
  bannerRadius = 'lg',
  objectPosition = 'center',
  overlayColor = '#01263B',
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  descriptionColor = '50',
  descriptionFontWeight = 'normal',
  descriptionColorHover,
  descriptionFontWeightHover,
  buttonBg = 'secondary',
  buttonBgHover,
  buttonText = 'btn',
  buttonTextFontWeight = 'medium',
  buttonTextHover,
  buttonTextFontWeightHover,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const { i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'
  const radiusClass = BANNER_RADIUS[bannerRadius] ?? BANNER_RADIUS.lg
  const heightClass = BANNER_HEIGHT[bannerHeight] ?? BANNER_HEIGHT.default
  // Theme token or raw #hex — keep the Figma navy when unset.
  const washColor =
    typeof overlayColor === 'string' && overlayColor.startsWith('#')
      ? overlayColor
      : colorVar(overlayColor) || '#01263B'
  const gradientDeg = isRtl ? 270 : 90

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
  }
  const descriptionStyleKeys = {
    descriptionColor,
    descriptionFontWeight,
    descriptionColorHover,
    descriptionFontWeightHover,
  }
  const buttonStyle = getButtonStyle(
    {
      buttonBg,
      buttonBgHover,
      buttonText,
      buttonTextFontWeight,
      buttonTextHover,
      buttonTextFontWeightHover,
    },
    {
      bgKey: 'buttonBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'buttonText',
      textFallback: 'btn',
      weightFallback: 'medium',
    },
  )
  // Legacy look: a custom background with no hover color set dims on hover.
  const dimOnHover = buttonBg !== 'secondary' && !buttonBgHover

  return (
    <section
      className={cx(SECTION_PADDING[sectionPadding], showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(
          'relative isolate flex w-full items-center overflow-hidden px-5 py-8 sm:px-10 md:px-14 md:py-12',
          heightClass,
          radiusClass,
        )}
      >
        {image && !showOverlay ? (
          <img
            src={image}
            alt={imageAlt || ''}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition }}
          />
        ) : null}

        {image && showOverlay ? (
          /* Figma fills (layer opacity 0.9, radius 12): Image @ 100% under a
             Linear wash — washColor @ 100% → washColor @ 0%, ending at 121.52%.
             No backdrop blur here: Figma's background blur doesn't blur the
             layer's own image fill. */
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]"
            style={{ opacity: 0.9 }}
          >
            <div className="absolute inset-0 rounded-[12px]" aria-hidden>
              <img
                src={image}
                alt=""
                className="absolute inset-0 size-full rounded-[12px] object-cover"
                style={{ objectPosition }}
              />
              <div
                className="absolute inset-0 rounded-[12px]"
                style={{
                  background: `linear-gradient(${gradientDeg}deg, ${washColor} 0%, color-mix(in srgb, ${washColor} 0%, transparent) 121.52%)`,
                }}
              />
            </div>
          </div>
        ) : null}

        {/* Accessible name when the wash stack uses an empty-alt decorative img */}
        {image && showOverlay ? (
          <span className="sr-only">{imageAlt || ''}</span>
        ) : null}

        {!image && showOverlay ? (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]"
            style={{
              opacity: 0.9,
              background: `linear-gradient(${gradientDeg}deg, ${washColor} 0%, rgba(1, 38, 59, 0) 121.52%)`,
              backdropFilter: 'blur(23.1px)',
              WebkitBackdropFilter: 'blur(23.1px)',
            }}
            aria-hidden
          />
        ) : null}

        <div className="relative z-2 flex max-w-xl flex-col gap-3 md:gap-5">
          {showTitle && title ? (
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {showDescription && description ? (
            <p
              className={cx(typography.sectionDescription, 'm-0 leading-relaxed', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(descriptionStyleKeys, 'descriptionColor', '50', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
          {showButton && cta ? (
            <LocalizedLink
              href={href}
              className={cx(
                typography.button,
                'no-underline rounded-lg px-6 py-3 md:px-8 md:py-3.5 inline-flex w-fit items-center gap-2.5',
                dimOnHover && 'hover:opacity-90',
                buttonStyle.className,
              )}
              style={buttonStyle.style}
            >
              {cta}
              <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
            </LocalizedLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
