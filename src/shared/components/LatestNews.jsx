import { ArrowRight, Clock } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import fallbackImage from '../../assets/images/media-center/latest-news.jpg'

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
 * Featured news list. Defaults match Media Center Latest News: image + copy
 * row, clock/category meta, secondary CTA.
 */
const LatestNews = ({
  title = '',
  readMore = '',
  items = [],
  imageRadius = '2xl',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  buttonBg = 'secondary',
  buttonHoverBg = 'secondary-800',
  iconColor = '600',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!title && !items.length) return null

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

  const inner = (
    <section className="flex flex-col gap-6 md:gap-8">
      {title ? (
        <h2
          className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'semibold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h2>
      ) : null}

      <div className="flex flex-col gap-10 md:gap-12">
        {items.map((item, index) => {
          const cta = item.cta || readMore
          return (
            <article
              key={item.id || index}
              className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10 xl:gap-14"
            >
              <div className={cx('w-full overflow-hidden lg:w-[min(48%,28rem)] lg:shrink-0 xl:w-[32.5rem]', radiusClass)}>
                <img
                  src={item.image || fallbackImage}
                  alt={item.imageAlt || ''}
                  className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[520/375]"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5">
                <div
                  className={cx('flex flex-wrap items-center gap-x-2 gap-y-1', typography.caption, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'metaColor', '600', 'normal')}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={16} weight="regular" className="shrink-0" style={{ color: colorVar(iconColor) }} aria-hidden />
                    <time dateTime={item.dateTime}>{item.date}</time>
                  </span>
                  <span aria-hidden className="text-500">·</span>
                  <span
                    className={cx('rounded-full bg-primary-1/10 px-3 py-1', typography.caption, CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'chipText', 'primary-1', 'medium')}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h3
                    className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardTitleColor', 'primary-1', 'semibold')}
                  >
                    <LinkedText text={item.title} {...linkProps} />
                  </h3>
                  <p
                    className={cx('m-0 leading-relaxed', typography.body, CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(textStyle, 'cardDescriptionColor', '700', 'normal')}
                  >
                    <LinkedText text={item.excerpt} {...linkProps} />
                  </p>
                </div>

                <LocalizedLink
                  href={item.href || '#'}
                  className={cx(
                    typography.button,
                    'inline-flex w-fit items-center gap-2 rounded-lg border-none px-6 py-3 no-underline md:px-8 md:py-3.5',
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={{
                    backgroundColor: colorVar(buttonBg),
                    ...getTextStyleVars(textStyle, 'buttonText', 'btn', 'semibold'),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colorVar(buttonHoverBg)
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colorVar(buttonBg)
                  }}
                >
                  {cta}
                  <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
                </LocalizedLink>
              </div>
            </article>
          )
        })}
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

export default LatestNews
