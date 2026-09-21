import { ArrowRight } from '@phosphor-icons/react'
import { typography } from '../../styles/typography.js'
import { colorVar, CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../styles/cmsStyle.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import planeBg from '../../assets/images/our-destenations/ph5.png'
import photoFalls from '../../assets/images/our-destenations/ph2.jpg'
import photoCity from '../../assets/images/our-destenations/ph3.jpg'
import photoCoast from '../../assets/images/our-destenations/ph4.jpg'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** Mirror cms2's DestinationsInspiration token maps so preview and public match. */
const BANNER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const stackPhotoClass =
  'rounded-2xl object-cover shadow-[0_8px_20px_rgba(0,0,0,0.28)] sm:shadow-none'

/** Accepts a theme token OR a raw #hex. */
const resolveColor = (value, fallbackToken) => {
  if (typeof value === 'string' && value.startsWith('#')) return value
  return colorVar(value) || colorVar(fallbackToken)
}

/** Symmetric horizontal wash (both ends 90%, middle 55%) over the photo. */
const inspirationWash = (css) =>
  `linear-gradient(to left, color-mix(in srgb, ${css} 90%, transparent) 0%, color-mix(in srgb, ${css} 55%, transparent) 50%, color-mix(in srgb, ${css} 90%, transparent) 100%)`

/**
 * Photo-stack promo banner. Defaults reproduce the static Our Destinations
 * "Find Inspiration" section; the CMS (via the section registry) can override
 * colours, radius, visibility flags, per-role hover, images, and backlinks.
 */
const DestinationsInspiration = ({
  // content
  title,
  description,
  cta,
  href = '#',
  bgImage,
  coastImage,
  coastImageAlt = '',
  fallsImage,
  fallsImageAlt = '',
  cityImage,
  cityImageAlt = '',
  // style
  showTitle = true,
  showDescription = true,
  showButton = true,
  showBgImage = true,
  showOverlay = true,
  bannerBg = 'secondary-2',
  bannerRadius = 'lg',
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  descriptionColor = '50',
  descriptionFontWeight = 'medium',
  descriptionColorHover,
  descriptionFontWeightHover,
  buttonBg = 'secondary',
  buttonText = 'btn',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  // backlinks
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  useCurrentLanguage() // re-render on language change (RTL handled via rtl: classes)
  const radiusClass = BANNER_RADIUS[bannerRadius] ?? BANNER_RADIUS.lg
  const bannerCss = resolveColor(bannerBg, 'secondary-2')

  const bgSrc = bgImage || planeBg
  const coastSrc = coastImage || photoCoast
  const fallsSrc = fallsImage || photoFalls
  const citySrc = cityImage || photoCity

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
      className={cx('relative overflow-hidden', radiusClass)}
      style={{ backgroundColor: bannerCss }}
    >
      {showBgImage && bgSrc ? (
        <img
          src={bgSrc}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover object-[60%_center] opacity-60 rtl:-scale-x-100"
        />
      ) : null}
      {showOverlay ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: inspirationWash(bannerCss) }}
          aria-hidden
        />
      ) : null}

      <div className="relative z-10 flex flex-col items-center gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-12">
        <div className="flex w-full max-w-xl flex-col items-start gap-3 md:gap-5 lg:flex-1">
          {showTitle && title ? (
            <h2
              className={cx(typography.sectionTitle, 'm-0 leading-tight', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {showDescription && description ? (
            <p
              className={cx(typography.sectionDescription, 'm-0 leading-relaxed', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(descriptionStyleKeys, 'descriptionColor', '50', 'medium')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
          {showButton && cta ? (
            <LocalizedLink
              href={href}
              className={cx(
                typography.button,
                'no-underline inline-flex items-center gap-2 rounded-lg px-6 py-3 md:px-8 md:py-4 w-fit transition-colors',
                isDefaultButtonBg ? 'bg-secondary hover:bg-secondary-800' : 'hover:opacity-90',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={{
                ...(isDefaultButtonBg ? {} : { backgroundColor: colorVar(buttonBg) }),
                ...getTextStyleVars(buttonTextStyleKeys, 'buttonText', 'btn', 'semibold'),
              }}
            >
              {cta}
              <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
            </LocalizedLink>
          ) : null}
        </div>

        <div className="relative flex h-64 w-full max-w-88 shrink-0 items-center justify-center sm:h-72 sm:max-w-96 lg:h-60 lg:max-w-104">
          <img
            src={coastSrc}
            alt={coastImageAlt}
            className={cx(stackPhotoClass, 'relative z-0 -me-5 h-[80%] w-[37%] sm:-me-4 sm:h-[75%] sm:w-[34%]')}
          />
          <img
            src={fallsSrc}
            alt={fallsImageAlt}
            className={cx(stackPhotoClass, 'relative z-10 h-full w-[46%] sm:w-[42%]')}
          />
          <img
            src={citySrc}
            alt={cityImageAlt}
            className={cx(stackPhotoClass, 'relative z-0 -ms-5 h-[80%] w-[37%] sm:-ms-4 sm:h-[75%] sm:w-[34%]')}
          />
        </div>
      </div>
    </section>
  )
}

export default DestinationsInspiration
