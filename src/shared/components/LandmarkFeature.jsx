import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import chevronLeft from '../../assets/icons/landmark/chevron-left.svg'
import Container from './Container.jsx'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import './landmarkGallery.css'

const IMAGE_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-6 md:py-8',
  default: 'py-10 md:py-14 lg:py-16',
  loose: 'py-14 md:py-20',
}

const arrowButtonClass =
  'grid size-[38.4px] cursor-pointer place-items-center rounded-full bg-white/90 p-[7.68px] shadow-[0_6px_4px_rgba(0,0,0,0.25)] transition duration-200 hover:scale-[1.08] hover:bg-white active:scale-[0.94]'

const SLIDE_MS = 950

const motionSide = (direction) => {
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
  if (!rtl) return direction
  return direction === 'right' ? 'left' : 'right'
}

/**
 * Photo, slide controls, and the thumbnail row that sits under that photo.
 * Arrows, dots, and the count sit on the image; the active thumb has a gold border.
 */
const LandmarkGallery = ({
  slides = [],
  alt = '',
  // Per-slide alt text (falls back to alt).
  alts = [],
  active = 0,
  onSelect,
  radiusClass,
  showCarousel = true,
  activeBorderColor = 'primary-2',
  mediaCell = '',
  thumbCell = '',
}) => {
  const { t } = useTranslation()
  const trackRef = useRef(null)
  const animating = useRef(false)
  const timer = useRef(null)
  const [outgoing, setOutgoing] = useState(null)
  const activeBorder = colorVar(activeBorderColor)

  useEffect(() => () => window.clearTimeout(timer.current), [])
  const count = slides.length

  const revealThumb = (index) => {
    const track = trackRef.current
    const thumb = track?.children[index]
    if (!track || !thumb) return
    const thumbLeft = thumb.offsetLeft
    const thumbRight = thumbLeft + thumb.offsetWidth
    const viewLeft = track.scrollLeft
    const viewRight = viewLeft + track.clientWidth
    if (thumbLeft >= viewLeft && thumbRight <= viewRight) return
    track.scrollTo({
      left: thumbLeft - (track.clientWidth - thumb.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }

  const goTo = (nextIndex, nextDirection) => {
    if (!count || nextIndex === active || animating.current) return
    const wrapped = (nextIndex + count) % count
    const direction = nextDirection ?? (wrapped > active ? 'right' : 'left')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce) {
      animating.current = true
      setOutgoing({ index: active, direction })
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        animating.current = false
        setOutgoing(null)
      }, SLIDE_MS)
    }
    onSelect?.(wrapped)
    revealThumb(wrapped)
  }

  if (!slides.length) return null
  const multiple = showCarousel && slides.length > 1
  const side = outgoing ? motionSide(outgoing.direction) : null

  return (
    <>
      <div className={mediaCell}>
        <div className={`relative isolate aspect-[644/454] overflow-hidden bg-[#e8e8e5] lg:h-[454px] lg:aspect-auto ${radiusClass}`}>
          {outgoing ? (
            <img
              src={slides[outgoing.index]}
              alt=""
              aria-hidden="true"
              className={`landmark-slide landmark-slide--exit-${side}`}
            />
          ) : null}
          <img
            key={active}
            src={slides[active]}
            alt={alts[active] ?? alt}
            className={`landmark-slide ${outgoing ? `landmark-slide--enter-${side}` : ''}`}
          />
          {multiple ? (
            <>
              <span className="absolute end-3.5 top-3.5 z-[3] inline-flex h-7 items-center rounded-[6px] bg-white/86 px-2.5 text-xs font-medium leading-none text-[#262e2b]">
                {active + 1} / {slides.length}
              </span>
              <div className="absolute inset-x-0 bottom-3 z-[3] flex items-center justify-center gap-[25.6px]">
                <button
                  type="button"
                  onClick={() => goTo(active - 1, 'left')}
                  aria-label={t('flightsToDamascus.carousel.prev')}
                  className={arrowButtonClass}
                >
                  <span className="inline-flex rtl:-scale-x-100">
                    <img src={chevronLeft} alt="" width="23.04" height="23.04" />
                  </span>
                </button>
                <div className="flex items-center gap-[7px] rounded-full bg-black/45 p-[7px] backdrop-blur-[8px]">
                  {slides.map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      aria-label={alts[index] || `${alt} ${index + 1}`.trim()}
                      aria-current={active === index}
                      onClick={() => goTo(index)}
                      className={`h-[7px] cursor-pointer rounded-full border-0 p-0 transition-[width,background-color] duration-300 ease-out ${
                        active === index ? 'w-5 bg-white' : 'w-[7px] bg-white/65'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => goTo(active + 1, 'right')}
                  aria-label={t('flightsToDamascus.carousel.next')}
                  className={arrowButtonClass}
                >
                  <span className="inline-flex rotate-180 rtl:-scale-x-100">
                    <img src={chevronLeft} alt="" width="23.04" height="23.04" />
                  </span>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {multiple ? (
        <div
          ref={trackRef}
          className={`flex gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] lg:row-start-2 [&::-webkit-scrollbar]:hidden ${thumbCell}`}
        >
          {slides.map((src, index) => (
            <button
              type="button"
              key={`${src}-thumb-${index}`}
              onClick={() => goTo(index)}
              aria-label={alts[index] || `${alt} ${index + 1}`.trim()}
              aria-current={active === index}
              className={`h-[110px] min-w-[96px] flex-1 basis-[96px] cursor-pointer overflow-hidden rounded-lg border-2 border-solid bg-transparent p-0 transition duration-300 ease-out ${
                active === index ? 'opacity-100' : 'opacity-50 hover:-translate-y-0.5 hover:opacity-80'
              }`}
              style={{ borderColor: active === index ? activeBorder : 'transparent' }}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </>
  )
}

/** One landmark: copy beside the photo, with the gallery under that photo. */
const LandmarkCard = ({ item, radiusClass, linkProps, titleStyleKeys, bodyStyleKeys, showCarousel, activeBorderColor }) => {
  const banner = item.image || ''
  const thumbs = (Array.isArray(item.thumbnails) ? item.thumbnails : [])
    .map((thumb) => thumb?.url || '')
    .filter(Boolean)
  // A CMS-set main image leads the carousel so it is what shows first —
  // otherwise the banner would open on thumbnail #1 and hide the upload.
  const slides = item.image
    ? [item.image, ...thumbs.filter((src) => src !== item.image)]
    : thumbs.length
      ? thumbs
      : banner
        ? [banner]
        : []

  // Each slide's own alt (main image: imageAlt, thumbnails: their alt —
  // both set from the media library); the banner fallback uses the main alt.
  const altBySrc = new Map(
    (Array.isArray(item.thumbnails) ? item.thumbnails : []).map((thumb) => [thumb?.url, thumb?.alt || '']),
  )
  if (item.image) altBySrc.set(item.image, item.imageAlt || '')
  const slideAlts = slides.map((src) => altBySrc.get(src) ?? (item.imageAlt || ''))

  const [active, setActive] = useState(0)
  const imageFirst = item.imageFirst === true
  const columns = imageFirst
    ? 'lg:grid-cols-[minmax(0,644px)_minmax(0,1fr)]'
    : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,644px)]'
  const mediaCell = imageFirst ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-2 lg:row-start-1'
  const copyCell = imageFirst ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-start-1 lg:row-start-1'
  const thumbCell = imageFirst ? 'lg:col-start-1' : 'lg:col-start-2'

  return (
    <div className={`grid w-full grid-cols-1 items-center gap-x-16 gap-y-5 xl:gap-x-28 ${columns}`}>
      <LandmarkGallery
        slides={slides}
        alt={item.imageAlt || ''}
        alts={slideAlts}
        active={Math.min(active, Math.max(slides.length - 1, 0))}
        onSelect={setActive}
        radiusClass={radiusClass}
        showCarousel={showCarousel}
        activeBorderColor={activeBorderColor}
        mediaCell={mediaCell}
        thumbCell={thumbCell}
      />
      <div className={`flex w-full max-w-[462px] flex-col gap-4 lg:gap-6 ${copyCell}`}>
        {item.title ? (
          <h2
            className={`m-0 text-2xl leading-normal sm:text-3xl lg:text-[40px] ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={item.title} {...linkProps} />
          </h2>
        ) : null}
        {item.description ? (
          <p
            className={`m-0 text-[15px] leading-[1.6] sm:text-base ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(bodyStyleKeys, 'bodyColor', '700', 'normal')}
          >
            <LinkedText text={item.description} {...linkProps} />
          </p>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Landmark feature cards. Defaults reproduce the static things-to-do-in-Damascus
 * landmarks: each item is a full-bleed `bg-50` band with Container gutters.
 */
const LandmarkFeature = ({
  items = [],
  imageRadius = 'lg',
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  bodyColor = '700',
  bodyFontWeight = 'normal',
  bodyColorHover,
  bodyFontWeightHover,
  showSectionBg = true,
  sectionBg = '50',
  sectionPadding = 'default',
  showCarousel = true,
  carouselBg = '50',
  arrowBg = 'secondary-900',
  arrowColor = '50',
  activeBorderColor = 'primary-2',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
}) => {
  if (!items.length) return null

  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS.lg
  const paddingClass = SECTION_PADDING[sectionPadding] || SECTION_PADDING.default
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
  const bodyStyleKeys = { bodyColor, bodyFontWeight, bodyColorHover, bodyFontWeightHover }
  const carouselProps = { activeBorderColor }

  return (
    <div className="flex w-full flex-col gap-6">
      {items.map((item, index) => (
        <section
          key={item.id || index}
          id={item.id || undefined}
          className="scroll-mt-28"
          style={
            showSectionBg
              ? { backgroundColor: colorVar(sectionBg) || colorVar('50') }
              : undefined
          }
        >
          <Container className={paddingClass}>
            <LandmarkCard
              item={item}
              radiusClass={radiusClass}
              linkProps={linkProps}
              titleStyleKeys={titleStyleKeys}
              bodyStyleKeys={bodyStyleKeys}
              showCarousel={showCarousel}
              activeBorderColor={carouselProps.activeBorderColor}
            />
          </Container>
        </section>
      ))}
    </div>
  )
}

export default LandmarkFeature
