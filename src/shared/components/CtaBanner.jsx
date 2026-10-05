import { useTranslation } from 'react-i18next'
import Button from './Button.jsx'
import { typography } from '../../styles/typography.js'
import {
  ALIGN,
  SECTION_PADDING,
  BANNER_HEIGHT,
  VERTICAL_ALIGN,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

// Byte-identical with cms2 CtaBanner BANNER_RADIUS_CLASS (the drawer's
// Square / Small / Rounded / Pill options) — the generic RADIUS map uses the
// same keys for different sizes (`full` = pill there, 24px here).
const BANNER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
  // Prop default when the CMS sends no radius.
  '2xl': 'rounded-2xl',
}

/**
 * Full-bleed photo CTA. Defaults match the original Help / Forms look;
 * the CMS (via the new-help section registry) can override any of them.
 * The background photo comes only from the CMS (`image`); none is bundled.
 */
const CtaBanner = ({
  title,
  description,
  cta,
  ctaIcon = '',
  href,
  image,
  imageAlt = '',
  showTitle = true,
  showButton = true,
  showButtonIcon = false,
  showDescription = true,
  showHeroImage = true,
  showOverlay = true,
  overlayColor = 'main',
  bannerHeight = 'default',
  bannerRadius = '2xl',
  titleAlign,
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  descriptionColor = '50',
  descriptionFontWeight = 'medium',
  descriptionColorHover,
  descriptionFontWeightHover,
  buttonBg = 'secondary',
  buttonBgHover,
  buttonText = 'btn',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  verticalAlign = 'center',
  sectionBg = '100',
  showSectionBg = false,
  sectionPadding = 'default',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  const { i18n } = useTranslation()
  const dir = i18n.dir() === 'rtl' ? 'rtl' : 'ltr'
  const overlay = colorVar(overlayColor)
  const CtaIcon = showButtonIcon && ctaIcon ? resolvePhosphorIcon(ctaIcon) : null
  const to = dir === 'rtl' ? 'left' : 'right'

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
      weightFallback: 'semibold',
    },
  )

  return (
    <section
      className={cx(
        SECTION_PADDING[sectionPadding],
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div
        className={cx(
          'relative overflow-hidden w-full bg-cover bg-no-repeat bg-center flex px-5 py-8 sm:px-12 md:px-20 md:py-16',
          BANNER_RADIUS[bannerRadius] || BANNER_RADIUS['2xl'],
          BANNER_HEIGHT[bannerHeight] || BANNER_HEIGHT.default,
          VERTICAL_ALIGN[verticalAlign] || VERTICAL_ALIGN.center,
        )}
        style={showHeroImage && image ? { backgroundImage: `url(${image})` } : undefined}
      >
        {showOverlay && overlay && (
          <>
            <div
              className="absolute inset-0 z-[1] md:hidden"
              style={{
                backgroundImage: `linear-gradient(to ${to}, ${overlay} 0%, ${overlay} 40%, transparent 100%)`,
              }}
            />
            <div
              className="absolute inset-0 z-[1] hidden md:block"
              style={{
                backgroundImage: `linear-gradient(to ${to}, ${overlay} 0%, transparent 100%)`,
              }}
            />
          </>
        )}

        <div
          className={cx(
            'relative z-[2] flex w-full max-w-xl flex-col gap-4 md:gap-6',
            ALIGN[titleAlign],
          )}
        >
          {showTitle && title && (
            <h2
              className={cx(
                typography.sectionTitle,
                'm-0',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '50', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          )}
          {showDescription && description && (
            <p
              className={cx(
                typography.sectionDescription,
                'm-0 leading-relaxed',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(descriptionStyleKeys, 'descriptionColor', '50', 'medium')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          )}
          {showButton && cta && (
            <Button
              href={href}
              className={cx(buttonStyle.className, 'max-md:!w-full', CtaIcon && 'gap-2')}
              style={buttonStyle.style}
            >
              {cta}
              {CtaIcon ? (
                <CtaIcon size={16} aria-hidden className="shrink-0 md:!size-6 rtl:-scale-x-100" />
              ) : null}
            </Button>
          )}
        </div>
        {imageAlt && showHeroImage && image ? (
          <span className="sr-only">{imageAlt}</span>
        ) : null}
      </div>
    </section>
  )
}

export default CtaBanner
