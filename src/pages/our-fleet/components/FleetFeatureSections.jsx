import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import modernPhoto from '../../../assets/images/our-fleet/modern-comfort.jpg'
import comfortPhoto from '../../../assets/images/our-fleet/cabin-features.jpg'

/**
 * "Modern convenience…" / "Features That Redefine Comfort" — alternating
 * copy + image rows. `imageFirst` puts the photo on the leading side on desktop
 * (modern = image right, comfort = image left); both stack image-over-text below
 * the `lg` breakpoint.
 */
const sections = [
  { id: 'modern', image: modernPhoto, imageFirst: false },
  { id: 'comfort', image: comfortPhoto, imageFirst: true },
]

const FleetFeatureSections = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {sections.map(({ id, image, imageFirst }) => (
        <section
          key={id}
          className={`flex flex-col items-center gap-6 lg:gap-20 ${
            imageFirst ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          <div className="w-full overflow-hidden rounded-2xl lg:w-[600px] lg:shrink-0">
            <img
              src={image}
              alt={t(`ourFleet.features.${id}.imageAlt`)}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col gap-3 lg:flex-1">
            <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
              {t(`ourFleet.features.${id}.title`)}
            </h2>
            <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>
              {t(`ourFleet.features.${id}.description`)}
            </p>
          </div>
        </section>
      ))}
    </div>
  )
}

export default FleetFeatureSections
