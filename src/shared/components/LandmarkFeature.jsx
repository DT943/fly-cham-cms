import { useRef, useState } from 'react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Container from './Container.jsx'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import umayyadImg from '../../assets/images/flights-to-damascus/umayyad.png'
import oldCityImg from '../../assets/images/flights-to-damascus/old-city.png'
import souqImg from '../../assets/images/flights-to-damascus/souq.png'
import umayyadThumb1 from '../../assets/images/flights-to-damascus/umayyad-thumb-1.png'
import umayyadThumb2 from '../../assets/images/flights-to-damascus/umayyad-thumb-2.png'
import umayyadThumb3 from '../../assets/images/flights-to-damascus/umayyad-thumb-3.png'
import umayyadThumb4 from '../../assets/images/flights-to-damascus/umayyad-thumb-4.png'
import umayyadThumb5 from '../../assets/images/flights-to-damascus/umayyad-thumb-5.png'
import oldCityThumb1 from '../../assets/images/flights-to-damascus/old-city-thumb-1.png'
import oldCityThumb2 from '../../assets/images/flights-to-damascus/old-city-thumb-2.png'
import oldCityThumb3 from '../../assets/images/flights-to-damascus/old-city-thumb-3.png'
import oldCityThumb4 from '../../assets/images/flights-to-damascus/old-city-thumb-4.png'
import oldCityThumb5 from '../../assets/images/flights-to-damascus/old-city-thumb-5.png'
import souqThumb1 from '../../assets/images/flights-to-damascus/souq-thumb-1.png'
import souqThumb2 from '../../assets/images/flights-to-damascus/souq-thumb-2.png'
import souqThumb3 from '../../assets/images/flights-to-damascus/souq-thumb-3.png'
import souqThumb4 from '../../assets/images/flights-to-damascus/souq-thumb-4.png'
import souqThumb5 from '../../assets/images/flights-to-damascus/souq-thumb-5.png'

const IMAGE_BY_ID = {
  umayyad: umayyadImg,
  oldCity: oldCityImg,
  souq: souqImg,
}

const THUMBS_BY_ID = {
  umayyad: [umayyadThumb1, umayyadThumb2, umayyadThumb3, umayyadThumb4, umayyadThumb5],
  oldCity: [oldCityThumb1, oldCityThumb2, oldCityThumb3, oldCityThumb4, oldCityThumb5],
  souq: [souqThumb1, souqThumb2, souqThumb3, souqThumb4, souqThumb5],
}

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

/**
 * Dark strip of image thumbnails with round arrows. The active thumb carries a
 * gold border; arrows scroll the row (and nudge the active index). Colours are
 * CMS-driven props defaulting to the source tokens.
 */
const ThumbnailStrip = ({
  images = [],
  altPrefix = '',
  active = 0,
  onSelect,
  carouselBg = '50',
  arrowBg = 'secondary-900',
  arrowColor = '50',
  activeBorderColor = 'primary-2',
}) => {
  const { t } = useTranslation()
  const trackRef = useRef(null)

  const select = (index) => {
    const last = images.length - 1
    if (last < 0) return
    const next = Math.min(Math.max(index, 0), last)
    onSelect?.(next)

    const track = trackRef.current
    const thumb = track?.children[next]
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

  if (!images.length) return null

  const arrowStyle = { backgroundColor: colorVar(arrowBg), color: colorVar(arrowColor) }
  const activeBorder = colorVar(activeBorderColor)

  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3 sm:gap-4 sm:p-4"
      style={{ backgroundColor: colorVar(carouselBg) }}
    >
      <button
        type="button"
        onClick={() => select(active - 1)}
        aria-label={t('flightsToDamascus.carousel.prev')}
        className="grid size-9 shrink-0 place-items-center rounded-full transition-opacity hover:opacity-90 sm:size-10"
        style={arrowStyle}
      >
        <CaretLeft size={16} weight="bold" className="rtl:-scale-x-100" />
      </button>

      <div
        ref={trackRef}
        className="flex flex-1 gap-3 overflow-x-auto scroll-smooth sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, index) => (
          <button
            type="button"
            key={`${src}-${index}`}
            onClick={() => select(index)}
            aria-label={`${altPrefix} ${index + 1}`.trim()}
            aria-current={active === index}
            className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border-[3px] border-solid sm:h-[110px] sm:w-auto sm:flex-1 sm:basis-0"
            style={{ borderColor: active === index ? activeBorder : 'transparent' }}
          >
            <img src={src} alt="" className="size-full object-cover" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => select(active + 1)}
        aria-label={t('flightsToDamascus.carousel.next')}
        className="grid size-9 shrink-0 place-items-center rounded-full transition-opacity hover:opacity-90 sm:size-10"
        style={arrowStyle}
      >
        <CaretRight size={16} weight="bold" className="rtl:-scale-x-100" />
      </button>
    </div>
  )
}

/** One landmark: photo + copy side by side, closed by the thumbnail strip. */
const LandmarkCard = ({ item, radiusClass, linkProps, titleStyleKeys, bodyStyleKeys, showCarousel, carouselProps }) => {
  const banner = item.image || IMAGE_BY_ID[item.id] || ''
  const editorThumbs = (Array.isArray(item.thumbnails) ? item.thumbnails : [])
    .map((thumb) => thumb?.url || '')
    .filter(Boolean)
  const thumbs = editorThumbs.length ? editorThumbs : THUMBS_BY_ID[item.id] || []
  // A CMS-set main image leads the carousel so it is what shows first —
  // otherwise the banner would open on thumbnail #1 and hide the upload.
  const slides = item.image
    ? [item.image, ...thumbs.filter((src) => src !== item.image)]
    : thumbs.length
      ? thumbs
      : banner
        ? [banner]
        : []

  const [active, setActive] = useState(0)
  const currentBanner = slides[active] || banner
  const imageFirst = item.imageFirst === true

  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-28">
        <img
          src={currentBanner}
          alt={item.imageAlt || ''}
          className={`h-64 w-full shrink-0 object-cover sm:h-80 lg:h-[454px] lg:w-[55%] ${radiusClass} ${imageFirst ? '' : 'lg:order-2'}`}
        />
        <div className={`flex w-full flex-col gap-4 lg:gap-6 ${imageFirst ? '' : 'lg:order-1'}`}>
          <h2
            className={`m-0 text-2xl sm:text-3xl lg:text-[40px] ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}
          >
            <LinkedText text={item.title} {...linkProps} />
          </h2>
          <p
            className={`m-0 text-sm leading-[1.6] sm:text-base ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(bodyStyleKeys, 'bodyColor', '700', 'normal')}
          >
            <LinkedText text={item.description} {...linkProps} />
          </p>
        </div>
      </div>
      {showCarousel && slides.length > 1 ? (
        <ThumbnailStrip images={slides} active={active} onSelect={setActive} altPrefix={item.imageAlt || ''} {...carouselProps} />
      ) : null}
    </>
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
  const carouselProps = { carouselBg, arrowBg, arrowColor, activeBorderColor }

  return (
    <div className="w-full">
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
          <Container className={`flex flex-col gap-8 lg:gap-10 ${paddingClass}`}>
            <LandmarkCard
              item={item}
              radiusClass={radiusClass}
              linkProps={linkProps}
              titleStyleKeys={titleStyleKeys}
              bodyStyleKeys={bodyStyleKeys}
              showCarousel={showCarousel}
              carouselProps={carouselProps}
            />
          </Container>
        </section>
      ))}
    </div>
  )
}

export default LandmarkFeature
