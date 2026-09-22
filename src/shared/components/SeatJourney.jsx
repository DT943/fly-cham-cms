import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'
import journeyPhoto from '../../assets/images/seat-selection/journey.jpg'

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

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

  const inner = (
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
