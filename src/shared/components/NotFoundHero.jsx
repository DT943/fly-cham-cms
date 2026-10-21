import { useTranslation } from 'react-i18next'
import LocalizedLink from './LocalizedLink.jsx'
import cloudsImage from '../../assets/images/not-found/clouds.jpg'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'

// Keep these maps byte-identical with flychamadmin cms2
// cmsComponents/NotFoundHero/utils/style.js.
const HEIGHT_CLASS = {
  screen: 'min-h-dvh',
  large: 'min-h-[560px] md:min-h-[680px]',
}
const OVERLAY_OPACITY = { 0: 0, 20: 0.2, 40: 0.4, 60: 0.6, 80: 0.8 }

// Pinned sizes (the two apps' typography scales differ at lg).
const EYEBROW_SIZE = 'text-sm sm:text-base md:text-lg lg:text-base'
const TITLE_SIZE = 'text-7xl leading-none tracking-tight sm:text-8xl md:text-9xl lg:text-[140px]'
const BUTTON_SIZE = 'text-sm sm:text-base'

/**
 * Full-bleed 404 hero — the CMS "not-found-hero" block (slug `not-found`) AND
 * the built-in fallback when the CMS page can't load. Every prop is optional:
 * missing text falls back to the `notFound.*` translations, so `<NotFoundHero />`
 * alone is the original 404 copy. Without a CMS photo the bundled clouds
 * photo is used.
 *
 * Cloud photo + navy overlay (#01263B66: secondary-2 @ 40%), centered eyebrow / "404" /
 * description, and a home CTA.
 */
const NotFoundHero = ({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  image,
  imageAlt,
  dir,
  height = 'screen',
  overlayColor = 'secondary-2',
  overlayOpacity = '40',
  showEyebrow = true,
  showDescription = true,
  showButton = true,
  ...style
}) => {
  const { t } = useTranslation()
  const text = (value, key) => (value === undefined ? t(key) : value)

  const eyebrowText = text(eyebrow, 'notFound.eyebrow')
  const titleText = text(title, 'notFound.title')
  const descriptionText = text(description, 'notFound.description')
  const ctaText = text(ctaLabel, 'notFound.cta')
  const opacity = OVERLAY_OPACITY[overlayOpacity] ?? OVERLAY_OPACITY[40]
  const photo = image || cloudsImage

  const button = getButtonStyle(style, {
    bgKey: 'buttonBg',
    bgFallback: 'secondary',
    bgHoverFallback: 'secondary-800',
    textKey: 'buttonText',
    textFallback: 'btn',
    weightFallback: 'semibold',
  })

  return (
    <section
      dir={dir}
      className={`relative flex w-full items-center justify-center overflow-hidden bg-secondary-2 ${
        HEIGHT_CLASS[height] ?? HEIGHT_CLASS.screen
      }`}
    >
      <div className="absolute inset-0">
        <img loading="lazy" decoding="async"
          src={photo}
          alt={imageAlt ?? t('notFound.imageAlt')}
          className="size-full object-cover"
        />
        {opacity > 0 ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: colorVar(overlayColor), opacity }}
            aria-hidden
          />
        ) : null}
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center sm:gap-5 md:gap-6">
        {showEyebrow && eyebrowText ? (
          <p
            className={`m-0 ${EYEBROW_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(style, 'eyebrowColor', '50', 'medium')}
          >
            {eyebrowText}
          </p>
        ) : null}

        {titleText ? (
          <h1
            className={`m-0 ${TITLE_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(style, 'titleColor', '50', 'bold')}
          >
            {titleText}
          </h1>
        ) : null}

        {showDescription && descriptionText ? (
          <p
            className={`m-0 opacity-90 ${EYEBROW_SIZE} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(style, 'descriptionColor', '50', 'normal')}
          >
            {descriptionText}
          </p>
        ) : null}

        {showButton && ctaText ? (
          <LocalizedLink
            href={ctaHref || '/'}
            className={`mt-2 inline-flex w-fit items-center justify-center rounded-lg px-6 py-3 no-underline transition-colors md:px-8 md:py-4 ${BUTTON_SIZE} ${button.className}`}
            style={button.style}
          >
            {ctaText}
          </LocalizedLink>
        ) : null}
      </div>
    </section>
  )
}

export default NotFoundHero
