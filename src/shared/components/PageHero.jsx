import { typography } from '../../styles/typography.js'
import { RADIUS, WEIGHT, ALIGN, SECTION_PADDING, colorVar } from '../../styles/cmsStyle.js'

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
      className={`w-full h-auto ${RADIUS[radius] || RADIUS['2xl']} object-cover object-[center_20%] aspect-[380/180] ${mask ? 'md:hidden' : ''}`}
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
  // style
  showTitle = true,
  showSubtitle = true,
  showImage = true,
  showMask = true,
  imageSide = 'right',
  imageRadius = '2xl',
  titleAlign = 'left',
  titleColor = 'primary-1',
  subtitleColor = '700',
  titleFontWeight = 'bold',
  subtitleFontWeight = 'medium',
  sectionBg = '100',
  showSectionBg = false,
  sectionPadding = 'default',
}) => {
  const effectiveMask = showMask ? mask : ''
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

  return (
    <section className={sectionClassName} style={sectionStyle}>
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
        className={`${hasImage ? `${textOrder} flex-1 ` : ''}flex flex-col gap-2 md:gap-4 ${ALIGN[titleAlign] || ''}`}
      >
        {showTitle && (
          <h1
            className={`${typography.pageTitle} ${WEIGHT[titleFontWeight] || 'font-bold'} leading-tight m-0`}
            style={{ color: colorVar(titleColor) }}
          >
            {title}
          </h1>
        )}
        {showSubtitle && subtitle && (
          <p
            className={`${typography.sectionDescription} ${WEIGHT[subtitleFontWeight] || 'font-medium'} m-0`}
            style={{ color: colorVar(subtitleColor) }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}

export default PageHero
