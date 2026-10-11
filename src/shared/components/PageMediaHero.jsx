import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pause, Play } from '@phosphor-icons/react'
import Container from './Container.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import { typography } from '../../styles/typography.js'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getButtonStyle,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
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

// Cover-layout title size at lg (`compact` = the home slider's 44px).
const TITLE_SIZE = {
  default: 'lg:text-[64px]',
  compact: 'lg:text-[44px]',
}

// Cover-layout white fade. Small screens wash up from the bottom so the title
// sits on white; from `md` the fade comes in from the reading-start edge.
// `wide` = Travel Updates Figma.
const OVERLAY_BOTTOM =
  'bg-[linear-gradient(to_top,rgb(253_253_252)_0%,rgb(253_253_252/0.92)_28%,rgb(253_253_252/0)_62%)]'
const OVERLAY = {
  default: `${OVERLAY_BOTTOM} md:bg-[linear-gradient(to_right,rgb(253_253_252/0.90)_28%,rgb(253_253_252/0)_55%)] md:rtl:bg-[linear-gradient(to_left,rgb(253_253_252/0.90)_28%,rgb(253_253_252/0)_55%)]`,
  wide: `${OVERLAY_BOTTOM} md:bg-[linear-gradient(to_right,rgb(253_253_252/0.90)_38.6%,rgb(253_253_252/0)_59.9%)] md:rtl:bg-[linear-gradient(to_left,rgb(253_253_252/0.90)_38.6%,rgb(253_253_252/0)_59.9%)]`,
}

const HERO_BUTTON = {
  bgKey: 'buttonBg',
  bgFallback: 'secondary',
  bgHoverFallback: 'secondary-800',
  textKey: 'buttonText',
  textFallback: '50',
  weightFallback: 'semibold',
}

/** Optional CTA — renders only with a label (and `showButton` on). */
const HeroButton = ({ label, href, show, buttonStyle }) => {
  if (!label || show === false) return null
  const btn = getButtonStyle(buttonStyle, HERO_BUTTON)
  return (
    <LocalizedLink
      href={href || '#'}
      className={`mt-2 inline-flex w-fit self-start items-center justify-center rounded-lg px-7 py-3 no-underline transition-colors md:px-8 md:py-3.5 ${typography.button} ${btn.className}`}
      style={btn.style}
    >
      {label}
    </LocalizedLink>
  )
}

/** Autoplay progress (0 → 1) with pause; advances the slide on completion. */
const useHeroSlider = (count, durationMs, autoplay) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(!autoplay)
  const [progress, setProgress] = useState(0)
  const startRef = useRef(Date.now())
  const pausedAtRef = useRef(0)
  const rafRef = useRef(0)

  const goTo = useCallback(
    (index) => {
      setActiveIndex(((index % count) + count) % count)
      setProgress(0)
      startRef.current = Date.now()
      pausedAtRef.current = 0
    },
    [count],
  )

  useEffect(() => {
    if (count < 2 || paused) {
      pausedAtRef.current = progress
      cancelAnimationFrame(rafRef.current)
      return undefined
    }

    startRef.current = Date.now() - pausedAtRef.current * durationMs

    const tick = () => {
      const next = Math.min((Date.now() - startRef.current) / durationMs, 1)
      setProgress(next)
      if (next >= 1) {
        setActiveIndex((current) => (current + 1) % count)
        setProgress(0)
        startRef.current = Date.now()
        pausedAtRef.current = 0
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, activeIndex, count, durationMs])

  return { activeIndex, paused, setPaused, progress, goTo }
}

/**
 * Cover-layout carousel: crossfading photos + text, with the home slider's
 * pause button, progress pill and dots. Used only when extra slides exist.
 */
const CoverSlider = ({
  slides,
  heightClass,
  widthClass,
  titleSizeClass,
  showOverlay,
  overlayClass,
  showTitle,
  showSubtitle,
  titleVars,
  subtitleVars,
  linkProps,
  showButton,
  buttonStyle,
  autoplay,
  slideDuration,
  showControls,
  controlsColor,
  controlsBottom,
}) => {
  const { t } = useTranslation()
  const durationMs = (Number(slideDuration) || 6) * 1000
  const slider = useHeroSlider(slides.length, durationMs, autoplay !== false)
  const accent = colorVar(controlsColor || 'secondary-2')
  const trackColor = `color-mix(in srgb, ${accent} 25%, white)`
  const controlsBottomPx = Number(controlsBottom) || 0

  return (
    <section
      className={`relative isolate overflow-hidden ${heightClass}`}
      aria-roledescription="carousel"
      aria-label={t('home.hero.carouselLabel')}
    >
      {slides.map((slide, index) =>
        slide.image ? (
          <img
            key={slide.id}
            src={slide.image}
            alt={index === slider.activeIndex ? slide.imageAlt : ''}
            aria-hidden={index !== slider.activeIndex}
            style={{ objectPosition: slide.objectPosition }}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out ${
              index === slider.activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null,
      )}
      {showOverlay && (
        <div className={`pointer-events-none absolute inset-0 ${overlayClass}`} />
      )}

      <Container className="relative flex h-full flex-col justify-end pb-8 md:justify-center md:pb-0">
        {slides.map((slide, index) => {
          const isActive = index === slider.activeIndex
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`flex flex-col gap-4 transition-opacity duration-500 ${widthClass} ${
                isActive ? 'relative opacity-100' : 'pointer-events-none absolute opacity-0'
              }`}
            >
              {showTitle && slide.title && (
                <h1
                  className={`${typography.pageTitle} m-0 leading-tight ${titleSizeClass} ${CMS_TEXT_HOVER_CLASS}`}
                  style={titleVars}
                >
                  <LinkedText text={slide.title} {...linkProps} />
                </h1>
              )}
              {showSubtitle && slide.subtitle && (
                <p
                  className={`${typography.sectionDescription} m-0 max-w-[430px] whitespace-pre-wrap leading-relaxed lg:text-lg ${CMS_TEXT_HOVER_CLASS}`}
                  style={subtitleVars}
                >
                  <LinkedText text={slide.subtitle} {...linkProps} />
                </p>
              )}
              <HeroButton
                label={slide.buttonLabel}
                href={slide.buttonHref}
                show={showButton}
                buttonStyle={buttonStyle}
              />
            </div>
          )
        })}
      </Container>

      {showControls !== false && (
        <div
          className={`absolute inset-x-0 z-10 ${controlsBottomPx ? '' : 'bottom-4'}`}
          style={controlsBottomPx ? { bottom: `${controlsBottomPx}px` } : undefined}
        >
          <Container className="flex justify-center">
            <div
              className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-1.5 shadow-[0_4px_16px_rgba(40,40,38,0.12)]"
              role="group"
              aria-label={t('home.hero.controlsLabel')}
            >
              <button
                type="button"
                onClick={() => slider.setPaused((value) => !value)}
                aria-label={slider.paused ? t('home.hero.play') : t('home.hero.pause')}
                className="grid size-7 cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0"
                style={{ color: accent }}
              >
                {slider.paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <div className="flex items-center gap-2.5">
                {slides.map((slide, index) =>
                  index === slider.activeIndex ? (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={t('home.hero.goToSlide', { index: index + 1 })}
                      aria-current="true"
                      onClick={() => slider.goTo(index)}
                      className="relative h-2 w-[60px] cursor-pointer overflow-hidden rounded-full border-0 p-0"
                      style={{ backgroundColor: trackColor }}
                    >
                      <span
                        className="absolute inset-y-0 start-0 rounded-full"
                        style={{ width: `${slider.progress * 100}%`, backgroundColor: accent }}
                      />
                    </button>
                  ) : (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={t('home.hero.goToSlide', { index: index + 1 })}
                      onClick={() => slider.goTo(index)}
                      className="size-2 shrink-0 cursor-pointer rounded-full border-0 p-0"
                      style={{ backgroundColor: trackColor }}
                    />
                  ),
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
      <span className="sr-only" aria-live="polite">
        {t('home.hero.slideStatus', { current: slider.activeIndex + 1, total: slides.length })}
      </span>
    </section>
  )
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
 *
 * Optional CMS extras: a CTA button (`buttonLabel`/`buttonHref`) and extra
 * `slides` — with at least one extra slide the cover layout becomes an
 * autoplay carousel (slide 1 = the main image/text/button).
 */
const PageMediaHero = ({
  // content
  image,
  imageAlt = '',
  title,
  subtitle,
  objectPosition = 'center',
  contentClassName = 'max-w-[605px]',
  buttonLabel = '',
  buttonHref = '',
  slides = [],
  // style
  layout = 'cover',
  sectionBg = '100',
  height = 'default',
  contentWidth,
  showTitle = true,
  showSubtitle = true,
  showOverlay = true,
  overlayWidth = 'default',
  titleColor = 'primary-1',
  subtitleColor = '700',
  titleFontWeight = 'bold',
  subtitleFontWeight = 'normal',
  titleColorHover,
  titleFontWeightHover,
  subtitleColorHover,
  subtitleFontWeightHover,
  titleSize = 'default',
  // optional button
  showButton = true,
  buttonBg,
  buttonBgHover,
  buttonText,
  buttonTextHover,
  buttonTextFontWeight,
  buttonTextFontWeightHover,
  // slider
  autoplay = true,
  slideDuration = '6',
  showControls = true,
  controlsColor = 'secondary-2',
  controlsBottom = 0,
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
  const buttonStyle = {
    buttonBg,
    buttonBgHover,
    buttonText,
    buttonTextHover,
    buttonTextFontWeight,
    buttonTextFontWeightHover,
  }
  const button = (
    <HeroButton label={buttonLabel} href={buttonHref} show={showButton} buttonStyle={buttonStyle} />
  )

  // ── Side layout: solid background, photo inset on the reading-end side ──────
  if (layout === 'side') {
    return (
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: colorVar(sectionBg) }}
      >
        <Container className="relative z-10">
          {/* Mobile: no padding above the title or below the photo (the page gap
              spaces the block); pb-8 only separates the text from the photo. */}
          <div className={`flex flex-col justify-center gap-2 md:gap-4 ${image ? 'pb-8' : ''} md:py-14 lg:py-16 md:min-h-[20rem] lg:min-h-[24rem] md:w-[46%] lg:w-[42%]`}>
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
            {button}
          </div>

          {image && (
            <img
              src={image}
              alt={imageAlt}
              className="md:hidden w-full h-auto rounded-2xl object-cover object-[center_30%] aspect-[380/180]"
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
  const titleSizeClass = TITLE_SIZE[titleSize] || TITLE_SIZE.default
  const overlayClass = OVERLAY[overlayWidth] || OVERLAY.default

  const extraSlides = (Array.isArray(slides) ? slides : []).filter((slide) => slide?.image)
  if (extraSlides.length) {
    const allSlides = [
      { id: 'main', image, imageAlt, objectPosition, title, subtitle, buttonLabel, buttonHref },
      ...extraSlides.map((slide, index) => ({
        id: slide.id || `slide-${index + 2}`,
        image: slide.image,
        imageAlt: slide.imageAlt || '',
        objectPosition: slide.objectPosition || objectPosition,
        title: slide.title || title,
        subtitle: slide.subtitle || subtitle,
        buttonLabel: slide.buttonLabel || buttonLabel,
        buttonHref: slide.buttonHref || buttonHref,
      })),
    ]
    return (
      <CoverSlider
        slides={allSlides}
        heightClass={heightClass}
        widthClass={widthClass}
        titleSizeClass={titleSizeClass}
        showOverlay={showOverlay}
        overlayClass={overlayClass}
        showTitle={showTitle}
        showSubtitle={showSubtitle}
        titleVars={titleVars}
        subtitleVars={subtitleVars}
        linkProps={linkProps}
        showButton={showButton}
        buttonStyle={buttonStyle}
        autoplay={autoplay}
        slideDuration={slideDuration}
        showControls={showControls}
        controlsColor={controlsColor}
        controlsBottom={controlsBottom}
      />
    )
  }

  return (
    <section className={`relative isolate overflow-hidden ${heightClass}`}>
      {image ? (
        <img
          src={image}
          alt={imageAlt}
          style={{ objectPosition }}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      {showOverlay && (
        <div
          className={`pointer-events-none absolute inset-0 ${overlayClass}`}
        />
      )}

      <Container className="relative flex h-full flex-col justify-end pb-8 md:justify-center md:pb-0">
        <div className={`flex flex-col gap-4 ${widthClass}`}>
          {showTitle && title && (
            <h1
              className={`${typography.pageTitle} m-0 leading-tight ${titleSizeClass} ${CMS_TEXT_HOVER_CLASS}`}
              style={titleVars}
            >
              <LinkedText text={title} {...linkProps} />
            </h1>
          )}
          {showSubtitle && subtitle && (
            <p
              className={`${typography.sectionDescription} m-0 max-w-[430px] whitespace-pre-wrap leading-relaxed lg:text-lg ${CMS_TEXT_HOVER_CLASS}`}
              style={subtitleVars}
            >
              <LinkedText text={subtitle} {...linkProps} />
            </p>
          )}
          {button}
        </div>
      </Container>
    </section>
  )
}

export default PageMediaHero
