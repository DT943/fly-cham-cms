import Container from './Container.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'

const COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * About Fly Cham — header + image cards + centered CTA (CMS-driven port of
 * pages/home/components/HomeAbout.jsx). Full-bleed: owns its section band and
 * Container. Defaults reproduce the static source exactly.
 */
const HomeAbout = ({
  title = '',
  subtitle = '',
  cards = [],
  ctaLabel = '',
  ctaHref = '/about-us',
  columns = '3',
  imageRadius = '2xl',
  showCta = true,
  showSectionBg = true,
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
  if (!title && !subtitle && !cards.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const columnsClass = COLUMNS[String(columns)] || COLUMNS[3]
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS['2xl']
  const btn = getButtonStyle(textStyle, {
    bgKey: 'buttonBg',
    bgFallback: 'secondary',
    bgHoverFallback: 'secondary-800',
    textKey: 'buttonText',
    textFallback: '700',
    weightFallback: 'semibold',
  })

  return (
    <section
      className="w-full min-w-0"
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <Container className="flex min-w-0 flex-col gap-6 py-10 md:gap-8 md:py-14">
        {title || subtitle ? (
          <div className="flex max-w-2xl flex-col gap-1.5 md:gap-2">
            {title ? (
              <h2
                className={cx('m-0', typography.sectionTitle, 'lg:text-[32px]', CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h2>
            ) : null}
            {subtitle ? (
              <p
                className={cx('m-0', typography.sectionDescription, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'subtitleColor', '600', 'normal')}
              >
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            ) : null}
          </div>
        ) : null}

        {cards.length ? (
          <div className={cx('grid gap-5 lg:gap-6', columnsClass)}>
            {cards.map((card, index) => {
              const src = card.image
              return (
                <article key={card.id || index} className="flex min-w-0 flex-col gap-3 md:gap-4">
                  {src ? (
                    <div className={cx('aspect-4/3 w-full overflow-hidden', radiusClass)}>
                      <img
                        src={src}
                        alt={card.imageAlt || ''}
                        className="size-full object-cover"
                        style={card.imagePosition ? { objectPosition: card.imagePosition } : undefined}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-1.5 md:gap-2">
                    {card.title ? (
                      <h3
                        className={cx('m-0', typography.itemTitle, CMS_TEXT_HOVER_CLASS)}
                        style={getTextStyleVars(textStyle, 'cardTitleColor', '700', 'semibold')}
                      >
                        <LinkedText text={card.title} {...linkProps} />
                      </h3>
                    ) : null}
                    {card.description ? (
                      <p
                        className={cx('m-0 leading-relaxed', typography.caption, CMS_TEXT_HOVER_CLASS)}
                        style={getTextStyleVars(textStyle, 'cardDescriptionColor', '600', 'normal')}
                      >
                        <LinkedText text={card.description} {...linkProps} />
                      </p>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : null}

        {showCta && ctaLabel ? (
          <div className="flex justify-center pt-1 md:pt-2">
            <LocalizedLink
              href={ctaHref || '/about-us'}
              className={cx(
                'inline-flex items-center justify-center rounded-lg px-7 py-3.5 no-underline transition-colors',
                typography.button,
                btn.className,
              )}
              style={btn.style}
            >
              {ctaLabel}
            </LocalizedLink>
          </div>
        ) : null}
      </Container>
    </section>
  )
}

export default HomeAbout
