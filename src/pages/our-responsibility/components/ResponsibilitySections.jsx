import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import passengersPhoto from '../../../assets/images/our-responsibility/passengers.jpg'
import communityPhoto from '../../../assets/images/our-responsibility/community.jpg'
import trainingPhoto from '../../../assets/images/our-responsibility/training.jpg'
import futureLeadersPhoto from '../../../assets/images/our-responsibility/future-leaders.jpg'

const sections = [
  { id: 'passengers', image: passengersPhoto, imageFirst: true },
  { id: 'community', image: communityPhoto, imageFirst: false },
  { id: 'training', image: trainingPhoto, imageFirst: true },
  { id: 'futureLeaders', image: futureLeadersPhoto, imageFirst: false },
]

const ResponsibilitySections = () => {
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
              alt={t(`ourResponsibility.sections.${id}.imageAlt`)}
              className="aspect-[607/375] w-full object-cover"
            />
          </div>
          <div className="flex w-full flex-col gap-3 lg:flex-1">
            <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
              {t(`ourResponsibility.sections.${id}.title`)}
            </h2>
            <p className={`m-0 font-normal leading-relaxed text-800 ${typography.body}`}>
              {t(`ourResponsibility.sections.${id}.description`)}
            </p>
          </div>
        </section>
      ))}
    </div>
  )
}

export default ResponsibilitySections
