import { typography } from '../../styles/typography.js'
import { colorVar, CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../styles/cmsStyle.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
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
  tall: 'min-h-[260px] sm:min-h-[320px] md:min-h-[380px]',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

/** Accepts a theme token OR a raw #hex, so the exact source navy is preserved. */
const resolveColor = (value, fallbackToken) => {
  if (typeof value === 'string' && value.startsWith('#')) return value
  return colorVar(value) || colorVar(fallbackToken)
}

const navyWash = (css, isRtl) => {
  const to = isRtl ? 'to left' : 'to right'
  return `linear-gradient(${to}, ${css} 0%, color-mix(in srgb, ${css} 80%, transparent) 42%, color-mix(in srgb, ${css} 0%, transparent) 100%)`
}

/**
 * Full-bleed image banner with a navy wash and a CTA. Defaults reproduce the
 * static Contact Us / Our GSA design; the CMS can override colours, height,
 * radius, padding, visibility flags, per-role hover, and backlinks.
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
  overlayColor = '#0B2A4A',
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  descriptionColor = '50',
  descriptionFontWeight = 'normal',
  descriptionColorHover,
  descriptionFontWeightHover,
  buttonBg = 'secondary',
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
  const isRtl = useCurrentLanguage() === 'ar'
  const radiusClass = BANNER_RADIUS[bannerRadius] ?? BANNER_RADIUS.lg
  const heightClass = BANNER_HEIGHT[bannerHeight] ?? BANNER_HEIGHT.default
  const overlayCss = resolveColor(overlayColor, 'secondary-2')

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
  const buttonTextStyleKeys = {
    buttonText,
    buttonTextFontWeight,
    buttonTextHover,
    buttonTextFontWeightHover,
  }

  const isDefaultButtonBg = buttonBg === 'secondary'

  return (
    <section
      className={cx(SECTION_PADDING[sectionPadding], showSectionBg && 'rounded-2xl px-4 md:px-6')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(
          'relative flex w-full items-center overflow-hidden px-5 py-8 sm:px-10 md:px-14 md:py-12',
          heightClass,
          radiusClass,
        )}
      >
        {image ? (
          <img
            src={image}
            alt={imageAlt || ''}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : null}
        {showOverlay ? (
          <div
            className="absolute inset-0 z-[1]"
            style={{ backgroundImage: navyWash(overlayCss, isRtl) }}
            aria-hidden
          />
        ) : null}

        <div className="relative z-[2] flex max-w-xl flex-col gap-3 md:gap-5">
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
                'no-underline rounded-lg px-6 py-3 md:px-8 md:py-3.5 w-fit transition-colors',
                isDefaultButtonBg ? 'bg-secondary hover:bg-secondary-800' : 'hover:opacity-90',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={{
                ...(isDefaultButtonBg ? {} : { backgroundColor: colorVar(buttonBg) }),
                ...getTextStyleVars(buttonTextStyleKeys, 'buttonText', 'btn', 'medium'),
              }}
            >
              {cta}
            </LocalizedLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
