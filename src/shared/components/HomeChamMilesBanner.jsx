import Container from './Container.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'

/** The left panel's brand gradient — literal, exactly as the source. */
const GRADIENT = 'linear-gradient(102.31deg, #006080 0%, #00141A 100%)'

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const BANNER_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/** Mix a CSS color with transparency (same as Tailwind v4's `text-50/90`). */
const withOpacity = (css, opacity) => {
  const amount = Number(opacity)
  if (!css || !Number.isFinite(amount) || amount >= 100) return css
  return `color-mix(in oklab, ${css} ${Math.max(0, amount)}%, transparent)`
}

/**
 * "Join Cham Miles" split banner — gradient panel (faded Cham Miles mark,
 * title, description, two CTAs) beside a cabin photo. CMS-driven port of
 * pages/home/components/HomeChamMilesBanner.jsx; every style prop defaults to
 * the source look; images come only from the CMS (an empty URL renders none).
 */
const HomeChamMilesBanner = ({
  title = '',
  description = '',
  joinLabel = '',
  joinHref = '/cham-miles',
  discoverLabel = '',
  discoverHref = '/cham-miles',
  photo,
  photoAlt = '',
  mark,
  sectionPadding = 'default',
  bannerRadius = 'lg',
  showSectionBg = false,
  sectionBg = '100',
  showDescription = true,
  showMark = true,
  markOpacity = 10,
  photoBg = 'primary-800',
  descriptionOpacity = 90,
  showJoinButton = true,
  showDiscoverButton = true,
  joinButtonBg = 'secondary',
  joinButtonBgHover = '',
  joinButtonText = '700',
  joinButtonTextHover = '700',
  joinButtonTextFontWeight = 'semibold',
  joinButtonTextFontWeightHover = 'semibold',
  discoverButtonBg = '50',
  discoverButtonBgHover = '',
  discoverButtonText = 'primary-1',
  discoverButtonTextHover = 'primary-1',
  discoverButtonTextFontWeight = 'semibold',
  discoverButtonTextFontWeightHover = 'semibold',
  titleColor = '50',
  titleFontWeight = 'semibold',
  titleColorHover = '50',
  titleFontWeightHover = 'semibold',
  descriptionColor = '50',
  descriptionFontWeight = 'normal',
  descriptionColorHover = '50',
  descriptionFontWeightHover = 'normal',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  if (!title && !description && !joinLabel && !discoverLabel) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const textStyle = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
    descriptionColor,
    descriptionFontWeight,
    descriptionColorHover,
    descriptionFontWeightHover,
  }

  const descriptionVars = getTextStyleVars(textStyle, 'descriptionColor', '50', 'normal')
  const descriptionStyle = {
    ...descriptionVars,
    color: withOpacity(descriptionVars.color, descriptionOpacity),
    '--cms-hc': withOpacity(descriptionVars['--cms-hc'], descriptionOpacity),
  }

  const joinBtn = getButtonStyle(
    {
      joinButtonBg,
      joinButtonBgHover,
      joinButtonText,
      joinButtonTextHover,
      joinButtonTextFontWeight,
      joinButtonTextFontWeightHover,
    },
    {
      bgKey: 'joinButtonBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'joinButtonText',
      textFallback: '700',
      weightFallback: 'semibold',
    },
  )
  // Discover CTA: built-in hover is the background at 90% (hover:bg-50/90).
  const discoverBtn = getButtonStyle(
    {
      discoverButtonBg,
      discoverButtonBgHover,
      discoverButtonText,
      discoverButtonTextHover,
      discoverButtonTextFontWeight,
      discoverButtonTextFontWeightHover,
    },
    {
      bgKey: 'discoverButtonBg',
      bgFallback: '50',
      textKey: 'discoverButtonText',
      textFallback: 'primary-1',
      weightFallback: 'semibold',
    },
  )
  if (!discoverButtonBgHover) {
    discoverBtn.style['--cms-bgh'] = withOpacity(discoverBtn.style.backgroundColor, 90)
  }

  const markAlpha = Number.isFinite(Number(markOpacity)) ? Number(markOpacity) / 100 : 0.1
  const buttonBase = `inline-flex items-center justify-center rounded-lg px-6 py-3 no-underline transition-colors ${typography.button}`

  return (
    <section
      className="w-full min-w-0"
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <Container className={SECTION_PADDING[sectionPadding] ?? SECTION_PADDING.default}>
        <div
          className={cx(
            'grid min-w-0 overflow-hidden lg:grid-cols-2',
            BANNER_RADIUS[bannerRadius] ?? BANNER_RADIUS.lg,
          )}
        >
          {/* Photo first on mobile; fixed aspect so object-cover never stretches. */}
          <div
            className="relative order-1 aspect-[16/10] overflow-hidden lg:order-2 lg:aspect-auto lg:min-h-full"
            style={{ backgroundColor: colorVar(photoBg) }}
          >
            {photo ? (
              <img loading="lazy" decoding="async"
                src={photo}
                alt={photoAlt}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            ) : null}
          </div>

          <div
            className="relative order-2 flex flex-col justify-between gap-6 overflow-hidden p-6 sm:gap-8 sm:p-8 md:p-10 lg:order-1 lg:min-h-80"
            style={{ background: GRADIENT }}
          >
            {showMark && mark ? (
              <img loading="lazy" decoding="async"
                src={mark}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-e-0 top-1/2 h-[220%] w-[min(58%,20rem)] max-w-none -translate-y-2/4 select-none object-cover object-left mix-blend-screen sm:w-[min(52%,24rem)] lg:w-[min(65%,28rem)]"
                style={{ opacity: markAlpha }}
              />
            ) : null}

            <div className="relative z-10 flex max-w-md flex-col gap-3">
              {title ? (
                <h2
                  className={cx(
                    'm-0 leading-tight',
                    typography.sectionTitle,
                    'lg:text-[32px]',
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={getTextStyleVars(textStyle, 'titleColor', '50', 'semibold')}
                >
                  <LinkedText text={title} {...linkProps} />
                </h2>
              ) : null}
              {showDescription && description ? (
                <p
                  className={cx(
                    'm-0 leading-relaxed',
                    typography.sectionDescription,
                    CMS_TEXT_HOVER_CLASS,
                  )}
                  style={descriptionStyle}
                >
                  <LinkedText text={description} {...linkProps} />
                </p>
              ) : null}
            </div>

            {(showJoinButton && joinLabel) || (showDiscoverButton && discoverLabel) ? (
              <div className="relative z-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                {showJoinButton && joinLabel ? (
                  <LocalizedLink
                    href={joinHref || '#'}
                    className={cx(buttonBase, 'w-full lowercase sm:w-auto', joinBtn.className)}
                    style={joinBtn.style}
                  >
                    {joinLabel}
                  </LocalizedLink>
                ) : null}
                {showDiscoverButton && discoverLabel ? (
                  <LocalizedLink
                    href={discoverHref || '#'}
                    className={cx(buttonBase, 'hidden lg:inline-flex', discoverBtn.className)}
                    style={discoverBtn.style}
                  >
                    {discoverLabel}
                  </LocalizedLink>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HomeChamMilesBanner
