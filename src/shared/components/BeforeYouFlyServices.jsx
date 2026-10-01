import { ArrowRight } from '@phosphor-icons/react'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const IMAGE_RADIUS = {
  none: 'sm:rounded-none',
  lg: 'sm:rounded-xl',
  '2xl': 'sm:rounded-2xl',
  '3xl': 'sm:rounded-3xl',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Before-you-fly service rows (optional header + a stacked list of photo +
 * title + description + CTA). CMS-driven: colours/weights/hover, image corners
 * and the section background are all controllable, with defaults matching the
 * source design. Images come only from the CMS; a row without an uploaded
 * image renders no photo.
 */
const BeforeYouFlyServices = ({
  title = '',
  subtitle = '',
  learnMore = '',
  items = [],
  showHeader = true,
  showTitle = true,
  showSubtitle = true,
  imageRadius = '2xl',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  dividerColor = '200',
  arrowBadgeBg = 'primary-1',
  arrowColor = '50',
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
  const headerVisible =
    showHeader && ((showTitle && title) || (showSubtitle && subtitle))

  const inner = (
    <section className="flex flex-col gap-4 sm:gap-0">
      {headerVisible ? (
        <div className="flex flex-col gap-2 pb-8 md:pb-10">
          {showTitle && title ? (
            <h2
              className={cx('m-0', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h2>
          ) : null}
          {showSubtitle && subtitle ? (
            <p
              className={cx('m-0', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(textStyle, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          ) : null}
        </div>
      ) : null}

      {items.map((item, index) => {
        const src = item.image || ''
        const cta = item.cta || learnMore
        return (
          <article
            key={item.id || index}
            className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_4px_6px_rgba(33,37,41,0.05)] sm:flex-row sm:items-center sm:gap-12 sm:overflow-visible sm:rounded-none sm:border-b sm:bg-transparent sm:py-6 sm:shadow-none"
            style={{ borderColor: colorVar(dividerColor) }}
          >
            {src ? (
              <img
                src={src}
                alt={item.imageAlt || ''}
                className={cx('h-48 w-full shrink-0 object-cover sm:h-43 sm:w-82', radiusClass)}
              />
            ) : null}
            <div className="flex flex-1 flex-col gap-3 p-4 sm:items-start sm:gap-4 sm:p-0">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <h3
                  className={cx('m-0 text-xl', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                >
                  <LinkedText text={item.title} {...linkProps} />
                </h3>
                <p
                  className={cx('m-0 text-sm leading-relaxed', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'cardDescriptionColor', '900', 'normal')}
                >
                  <LinkedText text={item.description} {...linkProps} />
                </p>
              </div>
              <LocalizedLink
                href={item.href || '#'}
                className={cx(
                  'group/lm relative inline-flex h-[34px] w-fit shrink-0 items-center self-end overflow-hidden rounded-full text-sm no-underline sm:self-auto',
                  typography.button,
                )}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 start-0 w-[34px] rounded-full transition-[width] duration-300 ease-out sm:group-hover/lm:w-full"
                  style={{ backgroundColor: colorVar(arrowBadgeBg) }}
                />
                <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="rtl:-scale-x-100"
                    style={{ color: colorVar(arrowColor) }}
                  />
                </span>
                {cta ? (
                  <span
                    className={`cms-lm-label relative z-10 hidden pe-3 ps-2.5 transition-[color,font-weight] duration-300 sm:inline ${CMS_TEXT_HOVER_CLASS}`}
                    style={getTextStyleVars(textStyle, 'learnMoreColor', 'primary-1', 'semibold')}
                  >
                    {cta}
                  </span>
                ) : null}
              </LocalizedLink>
            </div>
          </article>
        )
      })}
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

export default BeforeYouFlyServices
