import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, getButtonStyle, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import journeyPhoto from '../../assets/images/seat-selection/journey.jpg'

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '2xl-24': 'rounded-[24px]',
  '3xl': 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

// "wide" layout (Figma cargo Request row): title 28px / leading normal,
// description 16px / leading 1.5 — mirrors cms2 SeatJourneyPanel.
const WIDE_TITLE_SIZE = 'text-xl sm:text-2xl lg:text-[28px]'
const WIDE_BODY_SIZE = 'text-sm sm:text-base'

// Figma CTA: h 55, padding 10, radius 8, gap 10, label 18px, icon 29px.
const BUTTON_CLASS =
  'inline-flex h-[55px] items-center justify-center gap-[10px] self-start rounded-lg px-[10px] py-[10px] text-[18px] no-underline transition-colors'

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
 * controllable, with defaults matching the source design. Falls back to the
 * bundled seat-selection journey photo when no image is uploaded.
 */
const SeatJourney = ({
  title = '',
  description = '',
  image = '',
  imageAlt = '',
  buttonLabel = '',
  buttonHref = '',
  layout = 'default',
  showButton = true,
  showButtonIcon = true,
  imageSide = 'right',
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
  const src = image || journeyPhoto
  const hasButton = showButton !== false && Boolean(buttonLabel)
  const btn = hasButton ? getButtonStyle(textStyle, BUTTON_OPTS) : null
  const button = hasButton ? (
    <LocalizedLink href={buttonHref || '#'} className={cx(BUTTON_CLASS, btn.className)} style={btn.style}>
      <span>{buttonLabel}</span>
      {showButtonIcon !== false ? (
        <ArrowRight size={29} aria-hidden="true" className="shrink-0 rtl:-scale-x-100" />
      ) : null}
    </LocalizedLink>
  ) : null

  const inner = layout === 'wide' ? (
    <section
      className={cx(
        'flex flex-col items-center gap-8 lg:min-h-[352px] lg:justify-between lg:gap-6',
        imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="flex w-full flex-col justify-center gap-6 lg:w-[586px] lg:shrink">
        {title || description ? (
          <div className="flex flex-col gap-4">
            {title ? (
              <h2
                className={cx('m-0', WIDE_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={{ ...getTextStyleVars(textStyle, 'titleColor', '700', 'semibold'), lineHeight: 'normal' }}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {description ? (
              <p
                className={cx('m-0', WIDE_BODY_SIZE, CMS_TEXT_HOVER_CLASS)}
                style={{ ...getTextStyleVars(textStyle, 'bodyColor', '700', 'normal'), lineHeight: 1.5 }}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}
        {button}
      </div>
      <div className={cx('w-full overflow-hidden lg:h-[352px] lg:w-[563px] lg:shrink-0', radiusClass)}>
        <img
          src={src}
          alt={imageAlt || ''}
          className="aspect-[563/352] h-full w-full object-cover"
        />
      </div>
    </section>
  ) : (
    <section
      className={cx(
        'flex flex-col items-center gap-8 lg:gap-[105px]',
        imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="flex flex-col gap-4 lg:max-w-[508px] lg:gap-5">
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
            className={cx('m-0 leading-relaxed', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
        {button}
      </div>
      <div className={cx('w-full overflow-hidden lg:w-[615px] lg:shrink-0', radiusClass)}>
        <img
          src={src}
          alt={imageAlt || ''}
          className="aspect-[615/375] w-full object-cover"
        />
      </div>
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
