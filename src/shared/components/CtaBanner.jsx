import { useTranslation } from 'react-i18next'
import Button from './Button.jsx'
import { typography } from '../../styles/typography.js'
import {
  RADIUS,
  ALIGN,
  SECTION_PADDING,
  BANNER_HEIGHT,
  VERTICAL_ALIGN,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import defaultImage from '../../assets/images/help/ph1.png'

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Full-bleed photo CTA. Defaults match the original Help / Forms look;
 * the CMS (via the new-help section registry) can override any of them.
 */
const CtaBanner = ({
  title,
  description,
  cta,
  href,
  image = defaultImage,
  imageAlt = '',
  showTitle = true,
  showButton = true,
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
  buttonText = 'btn',
  buttonTextFontWeight = 'semibold',
  buttonTextHover,
  buttonTextFontWeightHover,
  verticalAlign = 'center',
  sectionBg = '100',
  showSectionBg = false,
  sectionPadding = 'default',
}) => {
  const { i18n } = useTranslation()
  const dir = i18n.dir() === 'rtl' ? 'rtl' : 'ltr'
  const overlay = colorVar(overlayColor)
  const to = dir === 'rtl' ? 'left' : 'right'

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
          RADIUS[bannerRadius] || RADIUS['2xl'],
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
            'relative z-[2] flex flex-col gap-4 md:gap-6 max-w-xl',
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
              {title}
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
              {description}
            </p>
          )}
          {showButton && cta && (
            <Button
              href={href}
              className={cx(
                (buttonBg !== 'secondary' || buttonText !== 'btn') && 'hover:opacity-90',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={{
                ...(buttonBg !== 'secondary' || buttonText !== 'btn'
                  ? { backgroundColor: colorVar(buttonBg) }
                  : {}),
                ...getTextStyleVars(buttonTextStyleKeys, 'buttonText', 'btn', 'semibold'),
              }}
            >
              {cta}
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
