import Container from './Container.jsx'
import { typography } from '../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'

// Full-bleed media-hero heights (cover layout). `default` reproduces the
// original static look.
const HERO_HEIGHT = {
  compact: 'h-64 sm:h-80 md:h-90 lg:h-100',
  default: 'h-80 sm:h-100 md:h-110 lg:h-125',
  tall: 'h-90 sm:h-110 md:h-125 lg:h-150',
}

// Width of the text column (cover layout). `default` matches `max-w-[605px]`.
const CONTENT_WIDTH = {
  narrow: 'max-w-[480px]',
  default: 'max-w-[605px]',
  wide: 'max-w-[760px]',
}

/**
 * Page media hero with two layouts:
 *  - `cover` (default): full-bleed background photo with a start-anchored fade
 *    and a title/subtitle block. Used across content pages (Travel Experience,
 *    Before You Fly, About Fly Cham, …).
 *  - `side`: solid section background with the photo inset on the reading-end
 *    side and a fade toward the text (the Our Destinations hero design).
 *
 * Every style prop defaults to the original `cover` look, so existing callers
 * that pass only `image`/`title`/`subtitle` (± `objectPosition`,
 * `contentClassName`) render byte-identically; the CMS (via the section
 * registry) can override any of them.
 */
const PageMediaHero = ({
  // content
  image,
  imageAlt = '',
  title,
  subtitle,
  objectPosition = 'center',
  contentClassName = 'max-w-[605px]',
  // When true, the section breaks out of a constraining parent (e.g. the CMS
  // page Container) to span the full viewport width. Static callers render
  // directly under a full-width <main>, so they leave this off.
  fullBleed = false,
  // style
  layout = 'cover',
  sectionBg = '100',
  height = 'default',
  contentWidth,
  showTitle = true,
  showSubtitle = true,
  showOverlay = true,
  titleColor = 'primary-1',
  subtitleColor = '700',
  titleFontWeight = 'bold',
  subtitleFontWeight = 'normal',
  titleColorHover,
  titleFontWeightHover,
  subtitleColorHover,
  subtitleFontWeightHover,
  // backlinks
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
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

  const titleStyleKeys = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
  }
  const subtitleStyleKeys = {
    subtitleColor,
    subtitleFontWeight,
    subtitleColorHover,
    subtitleFontWeightHover,
  }

  const titleVars = getTextStyleVars(titleStyleKeys, 'titleColor', 'primary-1', 'bold')
  const subtitleVars = getTextStyleVars(subtitleStyleKeys, 'subtitleColor', '700', 'normal')

  // Full-viewport-width breakout: works because the CMS page Container is
  // centered (mx-auto), so shifting to the container center then back by half
  // the viewport lands the section at the viewport's left edge.
  const bleedClass = fullBleed
    ? 'relative left-1/2 right-1/2 w-screen -translate-x-1/2'
    : ''

  // ── Side layout: solid background, photo inset on the reading-end side ──────
  if (layout === 'side') {
    return (
      <section
        className={`relative overflow-hidden ${bleedClass}`}
        style={{ backgroundColor: colorVar(sectionBg) }}
      >
        <Container className="relative z-10">
          <div className="flex flex-col justify-center gap-2 md:gap-4 py-8 md:py-14 lg:py-16 md:min-h-[20rem] lg:min-h-[24rem] md:w-[46%] lg:w-[42%]">
            {showTitle && title && (
              <h1
                className={`${typography.pageTitle} leading-tight m-0 ${CMS_TEXT_HOVER_CLASS}`}
                style={titleVars}
              >
                <LinkedText text={title} {...linkProps} />
              </h1>
            )}
            {showSubtitle && subtitle && (
              <p
                className={`${typography.sectionDescription} m-0 ${CMS_TEXT_HOVER_CLASS}`}
                style={subtitleVars}
              >
                <LinkedText text={subtitle} {...linkProps} />
              </p>
            )}
          </div>

          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="md:hidden w-full h-auto rounded-2xl object-cover object-[center_30%] aspect-[380/180] mb-6"
            />
          )}
        </Container>

        {image && (
          <div className="hidden md:block absolute inset-y-0 end-0 w-[58%] lg:w-[80%] pointer-events-none">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover object-[72%_center]"
            />
            {showOverlay && (
              <div className="absolute inset-0 bg-gradient-to-r from-100 from-0% via-100/75 via-[18%] to-transparent to-[48%] rtl:bg-gradient-to-l" />
            )}
          </div>
        )}
      </section>
    )
  }

  // ── Cover layout (default): full-bleed background photo ─────────────────────
  const heightClass = HERO_HEIGHT[height] || HERO_HEIGHT.default
  // `contentWidth` (CMS token) wins when set; otherwise honor `contentClassName`
  // so existing static call sites keep their custom width.
  const widthClass = contentWidth
    ? CONTENT_WIDTH[contentWidth] || contentClassName
    : contentClassName

  return (
    <section className={`relative isolate overflow-hidden ${heightClass} ${bleedClass}`}>
      <img
        src={image}
        alt={imageAlt}
        style={{ objectPosition }}
        className="absolute inset-0 size-full object-cover"
      />
      {showOverlay && (
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(253_253_252/0.90)_28%,rgb(253_253_252/0)_55%)] rtl:bg-[linear-gradient(to_left,rgb(253_253_252/0.90)_28%,rgb(253_253_252/0)_55%)]"
        />
      )}

      <Container className="relative flex h-full flex-col justify-center">
        <div className={`flex flex-col gap-4 ${widthClass}`}>
          {showTitle && title && (
            <h1
              className={`${typography.pageTitle} m-0 leading-tight lg:text-[64px] ${CMS_TEXT_HOVER_CLASS}`}
              style={titleVars}
            >
              <LinkedText text={title} {...linkProps} />
            </h1>
          )}
          {showSubtitle && subtitle && (
            <p
              className={`${typography.sectionDescription} m-0 max-w-[430px] leading-relaxed lg:text-lg ${CMS_TEXT_HOVER_CLASS}`}
              style={subtitleVars}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          )}
        </div>
      </Container>
    </section>
  )
}

export default PageMediaHero
