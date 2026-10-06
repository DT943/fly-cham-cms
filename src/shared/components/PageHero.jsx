import { typography } from '../../styles/typography.js'
import {
  SECTION_PADDING,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
// Default hero shape (content.imageMask overrides it per language).
const defaultHeroMask =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/page-hero-mask.webp'

// Logical alignment (start/end, not left/right) so the hero mirrors under RTL.
// `left` maps to the reading start, `right` to the reading end — matching the
// CMS editor preview. Includes `items-*` so the flex children align too.
const TITLE_ALIGN = {
  left: 'text-start items-start',
  center: 'text-center items-center',
  right: 'text-end items-end',
}

// Same scale as the cms2 Page Hero editor. `lg` is the editor default ("Rounded").
// `xl` / `2xl` / `3xl` cover older saved values so every header photo matches.
const IMAGE_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const maskStyle = (mask) => ({
  WebkitMaskImage: `url(${mask})`,
  maskImage: `url(${mask})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
})

const PageHeroImage = ({ image, mask, imageAlt, radius }) => (
  <div className="w-full">
    <img
      src={image}
      alt={imageAlt}
      className={`w-full h-auto ${IMAGE_RADIUS[radius] || IMAGE_RADIUS.lg} object-cover object-[center_20%] aspect-[380/180] ${mask ? 'md:hidden' : ''}`}
    />
    {mask && (
      <div
        className="hidden md:block w-full aspect-[573/330] rtl:-scale-x-100"
        style={maskStyle(mask)}
      >
        <div
          className="w-full h-full bg-cover bg-[position:center_20%] rtl:-scale-x-100"
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={imageAlt}
        />
      </div>
    )}
  </div>
)

/**
 * Page hero. Every prop below defaults to the component's original look, so
 * callers that pass only `title`/`subtitle` render exactly as before; the CMS
 * (via the new-help section registry) can override any of them dynamically.
 */
const PageHero = ({
  // content
  title,
  subtitle,
  image,
  mask,
  imageAlt = '',
  // layout direction ("rtl" for Arabic); undefined → inherit the page direction
  dir,
  // style
  showTitle = true,
  showSubtitle = true,
  showImage = true,
  showMask = true,
  imageSide = 'right',
  imageRadius = 'lg',
  titleAlign = 'left',
  titleColor = 'primary-1',
  subtitleColor = '700',
  titleFontWeight = 'bold',
  subtitleFontWeight = 'medium',
  titleColorHover,
  titleFontWeightHover,
  subtitleColorHover,
  subtitleFontWeightHover,
  sectionBg = '100',
  showSectionBg = false,
  sectionPadding = 'default',
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
  // `showMask` applies the shaped hero mask on desktop. A per-language
  // `mask` (content.imageMask) overrides the built-in default shape; when none
  // is provided the bundled default mask is used (matches the CMS editor).
  const effectiveMask = showMask ? mask || defaultHeroMask : ''
  const hasImage = showImage && Boolean(image)

  // imageSide === 'left' → image first on desktop; otherwise image on the right.
  const imageOrder = imageSide === 'left' ? 'order-1 md:order-1' : 'order-1 md:order-2'
  const textOrder = imageSide === 'left' ? 'order-2 md:order-2' : 'order-2 md:order-1'

  const sectionClassName = [
    hasImage
      ? 'flex flex-col md:flex-row md:items-center gap-5 md:gap-10 lg:gap-14'
      : 'flex flex-col gap-2 md:gap-4',
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const sectionStyle = showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined

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

  return (
    <section className={sectionClassName} style={sectionStyle} dir={dir}>
      {hasImage && (
        <div className={`${imageOrder} md:w-1/2 lg:w-[54%] shrink-0`}>
          <PageHeroImage
            image={image}
            mask={effectiveMask}
            imageAlt={imageAlt}
            radius={imageRadius}
          />
        </div>
      )}
      <div
        className={`${hasImage ? `${textOrder} flex-1 ` : ''}flex flex-col gap-2 md:gap-4 ${TITLE_ALIGN[titleAlign] || TITLE_ALIGN.left}`}
      >
        {showTitle && (
          <h1
            className={`${typography.pageTitle} leading-tight m-0 ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(titleStyleKeys, 'titleColor', 'primary-1', 'bold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h1>
        )}
        {showSubtitle && subtitle && (
          <p
            className={`${typography.sectionDescription} m-0 ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(subtitleStyleKeys, 'subtitleColor', '700', 'medium')}
          >
            <LinkedText text={subtitle} {...linkProps} />
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHero
