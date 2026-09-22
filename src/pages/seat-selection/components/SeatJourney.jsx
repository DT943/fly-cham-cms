import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import journeyPhoto from '../../../assets/images/seat-selection/journey.jpg'

const SeatJourney = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col items-center gap-8 lg:flex-row lg:gap-[105px]">
      <div className="flex flex-col gap-4 text-700 lg:max-w-[508px] lg:gap-5">
        <h2 className={`m-0 font-semibold ${typography.sectionTitle}`}>
          {t('seatSelection.journey.title')}
        </h2>
        <p className={`m-0 font-normal leading-relaxed ${typography.sectionDescription}`}>
          {t('seatSelection.journey.description')}
        </p>
      </div>
      <div className="w-full overflow-hidden rounded-3xl lg:w-[615px] lg:shrink-0">
        <img
          src={journeyPhoto}
          alt={t('seatSelection.journey.imageAlt')}
          className="aspect-[615/375] w-full object-cover"
        />
      </div>
    </section>
  )
}

export default SeatJourney
