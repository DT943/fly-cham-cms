import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import missionPhoto from '../../../assets/images/about-us/mission.jpg'
import visionPhoto from '../../../assets/images/about-us/vision.jpg'

/**
 * "Our Mission" / "Our Vision" — alternating image + copy rows. `imageFirst`
 * puts the photo on the leading side on desktop (Mission = left, Vision = right);
 * both stack image-over-text below the `lg` breakpoint.
 */
const sections = [
  { id: 'mission', image: missionPhoto, imageFirst: true },
  { id: 'vision', image: visionPhoto, imageFirst: false },
]

const AboutStorySections = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-9 md:gap-[35px]">
      {sections.map(({ id, image, imageFirst }) => (
        <section
          key={id}
          className={`flex flex-col items-center gap-6 lg:gap-[105px] ${
            imageFirst ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          <div className="w-full overflow-hidden rounded-2xl lg:w-[607px] lg:shrink-0">
            <img
              src={image}
              alt={t(`aboutUs.${id}.imageAlt`)}
              className="aspect-[607/375] w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col gap-3 lg:flex-1">
            <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
              {t(`aboutUs.${id}.title`)}
            </h2>
            <p className={`m-0 font-normal leading-relaxed text-800 ${typography.body}`}>
              {t(`aboutUs.${id}.description`)}
            </p>
          </div>
        </section>
      ))}
    </div>
  )
}

export default AboutStorySections
