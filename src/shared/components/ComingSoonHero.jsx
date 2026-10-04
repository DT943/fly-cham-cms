import Container from './Container.jsx'
import LinkedText from './backlinks/LinkedText.jsx'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'

const clampPercent = (value, fallback) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(100, Math.max(0, n))
}

/** Overlay token → CSS ("black" is not a theme token; it is the source wash). */
const overlayCss = (token) => (!token || token === 'black' ? '#000000' : colorVar(token))

/** Mix a CSS color with transparency (0–100), like Tailwind's `text-50/90`. */
const withAlpha = (css, opacity) =>
  !css || opacity >= 100 ? css : `color-mix(in oklab, ${css} ${opacity}%, transparent)`

/**
 * CMS "coming-soon-hero" block — the whole /coming-soon page as one full-bleed
 * block: photo (CMS URL only), color wash, title + description aligned
 * top-start. Pulls up under the sticky header (dark over media, see
 * isFullBleedPath). Defaults reproduce the old static ComingSoon page exactly.
 */
const ComingSoonHero = ({
  imageUrl,
  imageAlt = '',
  title = '',
  description = '',
  overlayColor = 'black',
  overlayOpacity = 20,
  descriptionOpacity = 90,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const overlayAmount = clampPercent(overlayOpacity, 20)
  const descriptionAmount = clampPercent(descriptionOpacity, 90)
  const descriptionVars = getTextStyleVars(textStyle, 'descriptionColor', '50', 'normal')
  const descriptionStyle = {
    ...descriptionVars,
    color: withAlpha(descriptionVars.color, descriptionAmount),
    '--cms-hc': withAlpha(descriptionVars['--cms-hc'], descriptionAmount),
  }

  return (
    <section className="relative flex min-h-dvh w-full flex-1 overflow-hidden -mt-16 pt-16 md:-mt-18 md:pt-18">
      <div className="absolute inset-0">
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} className="object-cover w-full h-full" />
        ) : null}
        {overlayAmount > 0 ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayCss(overlayColor), opacity: overlayAmount / 100 }}
            aria-hidden
          />
        ) : null}
      </div>

      <Container className="relative z-10 flex w-full flex-col justify-start pt-10 pb-16 md:pt-14 lg:pt-20">
        <div className="flex max-w-xl flex-col gap-3 md:max-w-2xl md:gap-4">
          {title ? (
            <h1
              className={`m-0 leading-tight tracking-tight ${typography.pageTitle} lg:text-[56px] ${CMS_TEXT_HOVER_CLASS}`}
              style={getTextStyleVars(textStyle, 'titleColor', '50', 'bold')}
            >
              <LinkedText text={title} {...linkProps} />
            </h1>
          ) : null}
          {description ? (
            <p
              className={`m-0 max-w-lg leading-relaxed ${typography.sectionDescription} ${CMS_TEXT_HOVER_CLASS}`}
              style={descriptionStyle}
            >
              <LinkedText text={description} {...linkProps} />
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

export default ComingSoonHero
