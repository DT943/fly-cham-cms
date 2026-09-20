import { CMS_TEXT_HOVER_CLASS, getTextStyleVars, colorVar } from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'
import specialPhoto from '../../assets/images/things-to-do-in-damascus/special.png'
import cuisinePhoto from '../../assets/images/things-to-do-in-damascus/cuisine.png'
import placesPhoto from '../../assets/images/things-to-do-in-damascus/places.png'
import activitiesPhoto from '../../assets/images/things-to-do-in-damascus/activities.png'

const IMAGE_BY_ID = {
  special: specialPhoto,
  cuisine: cuisinePhoto,
  places: placesPhoto,
  activities: activitiesPhoto,
}

const IMAGE_RADIUS = {
  none: 'rounded-none',
  sm: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-3xl',
}

const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

/**
 * Alternating image + text narrative rows. Defaults reproduce the static
 * destination-guide narratives; the CMS (via the section registry) can override
 * the rows, per-row title colour/weight/side, image, body colour and backlinks.
 */
const DestinationNarratives = ({
  items = [],
  imageRadius = 'lg',
  bodyColor = '800',
  bodyFontWeight = 'normal',
  bodyColorHover,
  bodyFontWeightHover,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'none',
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
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const bodyStyleKeys = { bodyColor, bodyFontWeight, bodyColorHover, bodyFontWeightHover }

  const inner = (
    <div className="flex flex-col gap-10 md:gap-14 lg:gap-20">
      {items.map((item, index) => {
        const src = item.image || IMAGE_BY_ID[item.id] || ''
        const imageFirst = item.imageFirst !== false
        return (
          <section
            key={item.id || index}
            className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
          >
            <img
              src={src}
              alt={item.imageAlt || ''}
              className={`h-55 w-full shrink-0 object-cover sm:h-70 lg:h-80 lg:w-140 ${radiusClass} ${imageFirst ? '' : 'lg:order-2'}`}
            />
            <div
              className={`flex w-full flex-col justify-center gap-3 lg:w-150 lg:gap-5 ${imageFirst ? '' : 'lg:order-1'}`}
            >
              <h2
                className={`m-0 text-xl sm:text-2xl lg:text-[28px] ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(
                  { titleColor: item.titleColor, titleFontWeight: item.titleFontWeight },
                  'titleColor',
                  'primary-800',
                  'semibold',
                )}
              >
                <LinkedText text={item.title} {...linkProps} />
              </h2>
              <p
                className={`m-0 text-sm leading-[1.6] sm:text-base ${CMS_TEXT_HOVER_CLASS}`}
                style={getTextStyleVars(bodyStyleKeys, 'bodyColor', '800', 'normal')}
              >
                <LinkedText text={item.description} {...linkProps} />
              </p>
            </div>
          </section>
        )
      })}
    </div>
  )

  const sectionClass = [
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default DestinationNarratives
