import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

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
 * Marhaba magazine intro: blurb on one side, latest cover on the other.
 * CMS-driven colours/weights/hover, image side and corners; defaults match the
 * source Traveler Magazine intro. The cover comes only from the CMS; with no
 * image uploaded it is not rendered.
 */
const MarhabaIntro = ({
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
  const src = image

  const inner = (
    <section
      className={cx(
        'flex flex-col items-center gap-8 lg:justify-between lg:gap-12',
        imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <div className="flex max-w-[476px] flex-col gap-4.5">
        {title ? (
          <h2
            className={cx(
              'm-0 leading-tight',
              typography.sectionTitle,
              'lg:text-[32px]',
              CMS_TEXT_HOVER_CLASS,
            )}
            style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
        {description ? (
          <p
            className={cx('m-0 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(textStyle, 'bodyColor', '700', 'normal')}
          >
            <LinkedText text={description} {...linkProps} />
          </p>
        ) : null}
      </div>

      {src ? (
        <img
          src={src}
          alt={imageAlt || ''}
          className={cx(
            'aspect-[3/4] w-full max-w-[300px] shrink-0 object-cover shadow-[0px_12px_32px_rgba(1,38,59,0.18)]',
            radiusClass,
          )}
        />
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

export default MarhabaIntro
