import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const ROW_GAP = {
  tight: 'gap-6',
  default: 'gap-9 md:gap-[35px]',
  loose: 'gap-12 md:gap-16',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Alternating image + text rows (title + paragraph beside a photo). CMS-driven:
 * colours/weights/hover, image side (per row), corners, row gap and the section
 * background are all controllable, with defaults matching the source. Images
 * come only from the CMS; a row without an uploaded image renders no photo.
 */
const ResponsibilitySections = ({
  items = [],
  imageRadius = '2xl',
  rowGap = 'default',
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
  if (!items.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS['2xl']
  const rowGapClass = ROW_GAP[rowGap] || ROW_GAP.default

  const inner = (
    <div className={cx('flex flex-col', rowGapClass)}>
      {items.map((item, index) => {
        const src = item.image || ''
        const imageFirst = item.imageFirst !== false
        return (
          <section
            key={item.id || index}
            className={cx(
              'flex flex-col items-center gap-6 lg:gap-[105px]',
              imageFirst ? 'lg:flex-row' : 'lg:flex-row-reverse',
            )}
          >
            {src ? (
              <div className={cx('w-full overflow-hidden lg:w-[607px] lg:shrink-0', radiusClass)}>
                <img
                  src={src}
                  alt={item.imageAlt || ''}
                  className="aspect-[607/375] w-full object-cover"
                />
              </div>
            ) : null}
            <div className="flex w-full flex-col gap-3 lg:flex-1">
              <h2
                className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'titleColor', '800', 'semibold')}
              >
                <LinkedText text={item.title} {...linkProps} />
              </h2>
              <p
                className={cx('m-0 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'bodyColor', '800', 'normal')}
              >
                <LinkedText text={item.description} {...linkProps} />
              </p>
            </div>
          </section>
        )
      })}
    </div>
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

export default ResponsibilitySections
