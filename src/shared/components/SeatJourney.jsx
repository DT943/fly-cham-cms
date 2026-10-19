import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, getButtonStyle, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '2xl-24': 'rounded-[24px]',
  '3xl': 'rounded-3xl',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

// "wide" layout (cargo Request row): the photo fills the card and the
// title, description, and button sit on top of it — mirrors cms2 SeatJourneyPanel.
const WIDE_TITLE_SIZE = 'text-xl sm:text-2xl lg:text-[28px]'
const WIDE_BODY_SIZE = 'text-sm sm:text-base'

// Figma CTA: h 55, padding 10, radius 8, gap 10, label 18px, icon 29px.
const BUTTON_CLASS =
  'inline-flex w-full items-center justify-center self-start rounded-lg no-underline transition-colors lg:w-fit'

// Keep byte-identical with cms2 SeatJourney BUTTON_SIZE_CLASS ("large" = original CTA).
const BUTTON_SIZE_CLASS = {
  large: 'h-[55px] gap-[10px] px-[10px] py-[10px] text-[18px]',
  medium: 'h-[52px] gap-2 px-[14px] py-3 text-base',
}
const BUTTON_ICON_SIZE = { large: 29, medium: 18 }

// 'promo' layout (Offers & Deals Cham Miles row, Figma 40951:24674): 22px →
// 28px title, 14px → 16px body, a 171 × 48/49px button, photo first on mobile.
// Keep byte-identical with cms2 SeatJourneyPanel.
const PROMO_TITLE_SIZE = 'text-[22px] leading-[1.4] lg:text-[28px] lg:leading-[1.5]'
const PROMO_BODY_SIZE = 'text-sm leading-[1.75] lg:text-base lg:leading-[28px]'
const PROMO_BUTTON_CLASS =
  'inline-flex h-12 w-max min-w-[171px] max-w-full items-center justify-center gap-[10px] self-start whitespace-nowrap rounded-lg px-[10px] py-3 text-base leading-[normal] no-underline transition-colors lg:h-[49px]'

const CONTENT_ALIGN_CLASS = {
  start: 'lg:items-start',
  center: 'lg:items-center',
  end: 'lg:items-end',
}

const OVERLAY_WASH = {
  backgroundImage:
    'linear-gradient(to right, #01263b 0%, rgba(1,38,59,0.82) 34%, rgba(1,38,59,0.35) 62%, transparent 82%)',
}

const BUTTON_OPTS = {
  bgKey: 'buttonBg',
  bgFallback: 'primary-1',
  bgHoverFallback: 'primary-700',
  textKey: 'buttonText',
  textFallback: '50',
  weightFallback: 'semibold',
}

/**
 * A single image + text row (heading, paragraph, side photo). CMS-driven:
 * colours/weights/hover, image side, corners and the section background are all
 * controllable, with defaults matching the source design. The photo is passed
 * from the CMS adapter (bucket default when the block has no imageUrl).
 */
const SeatJourney = ({
  title = '',
  description = '',
  image = '',
  imageAlt = '',
  buttonLabel = '',
  buttonHref = '',
  buttonIcon = '',
  buttonSize = 'large',
  layout = 'default',
  showButton = true,
  showButtonIcon = true,
  imageSide = 'right',
  contentAlign = 'center',
  imageRadius = '3xl',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!title && !description && !image) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS['3xl']
  const imageFirst = imageSide === 'left'
  const src = image
  const hasButton = showButton !== false && Boolean(buttonLabel)
  const btn = hasButton ? getButtonStyle(textStyle, BUTTON_OPTS) : null
  const size = buttonSize in BUTTON_SIZE_CLASS ? buttonSize : 'large'
  const ButtonIcon = resolvePhosphorIcon(buttonIcon || 'ArrowRight')
  const promo = layout === 'promo'
  const button = hasButton ? (
    <LocalizedLink
      href={buttonHref || '#'}
      className={cx(promo ? PROMO_BUTTON_CLASS : cx(BUTTON_CLASS, BUTTON_SIZE_CLASS[size]), btn.className)}
      style={btn.style}
    >
      <span>{buttonLabel}</span>
      {showButtonIcon !== false ? (
        <ButtonIcon size={promo ? 18 : BUTTON_ICON_SIZE[size]} aria-hidden="true" className="shrink-0 rtl:-scale-x-100" />
      ) : null}
    </LocalizedLink>
  ) : null

  const overlayText = {
    ...textStyle,
    titleColor: '50',
    titleColorHover: '50',
    bodyColor: '50',
    bodyColorHover: '50',
  }

  const inner = promo ? (
    <section
      className={cx(
        'flex flex-col gap-5 lg:items-center lg:gap-[105px]',
        imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="flex flex-col gap-5 lg:min-w-0 lg:flex-1 lg:gap-[22px]">
        {title ? (
          <h2
            className={cx('m-0', PROMO_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {description ? (
          <p
            className={cx('m-0 whitespace-normal lg:whitespace-pre-line', PROMO_BODY_SIZE, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
        {button}
      </div>
      {src ? (
        <div className={cx('order-first w-full overflow-hidden lg:order-none lg:w-[621px] lg:shrink-0', radiusClass)}>
          <img src={src} alt={imageAlt || ''} className="block h-[216px] w-full object-cover lg:h-[375px]" />
        </div>
      ) : null}
    </section>
  ) : layout === 'wide' ? (
    <section
      className={cx('relative isolate min-h-[280px] overflow-hidden md:min-h-[340px]', radiusClass)}
      style={{
        backgroundColor: '#01263b',
        backgroundImage: src ? `url("${src}")` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {imageAlt ? <span className="sr-only">{imageAlt}</span> : null}
      <div
        aria-hidden
        className="rtl:scale-x-[-1]"
        style={{ ...OVERLAY_WASH, position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <div className="relative z-[1] flex min-h-[280px] w-full max-w-[560px] flex-col justify-center gap-4 px-6 py-8 md:min-h-[340px] md:gap-6 md:px-10">
        {title || description ? (
          <div className="flex flex-col gap-4">
            {title ? (
              <h2
                className={cx('m-0', WIDE_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={{ ...getTextStyleVars(overlayText, 'titleColor', '50', 'semibold'), color: '#fdfdfc', lineHeight: 'normal' }}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {description ? (
              <p
                className={cx('m-0', WIDE_BODY_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={{ ...getTextStyleVars(overlayText, 'bodyColor', '50', 'normal'), color: '#fdfdfc', lineHeight: 1.5 }}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}
        {button}
      </div>
    </section>
  ) : (
    <section
      className={cx(
        'flex flex-col items-center gap-8 lg:gap-[105px]',
        CONTENT_ALIGN_CLASS[contentAlign] || CONTENT_ALIGN_CLASS.center,
        imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="contents lg:flex lg:w-auto lg:max-w-[508px] lg:flex-col lg:gap-5">
        <div className="order-1 flex w-full flex-col gap-4 lg:contents">
          {title ? (
            <h2
              className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {description ? (
            <p
              className={cx('m-0 whitespace-pre-line leading-relaxed', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
        </div>
        {button ? <div className="order-3 w-full lg:order-none lg:w-auto">{button}</div> : null}
      </div>
      {src ? (
        <div className={cx('order-2 w-full overflow-hidden lg:order-none lg:w-[615px] lg:shrink-0', radiusClass)}>
          <img
            src={src}
            alt={imageAlt || ''}
            className="aspect-[615/375] w-full object-cover"
          />
        </div>
      ) : null}
    </section>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )

  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default SeatJourney
