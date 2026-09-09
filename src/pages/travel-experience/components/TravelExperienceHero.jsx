import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import heroPhoto from '../../../assets/images/travel-experience/hero.png'

const TravelExperienceHero = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden h-90 sm:h-100 md:h-110 lg:h-125">
      <img
        src={heroPhoto}
        alt={t('travelExperience.hero.imageAlt')}
        className="absolute inset-0 size-full object-cover object-[center_30%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#006080] from-[18%] to-transparent to-[72%] rtl:bg-linear-to-l" />

      <Container className="relative flex h-full flex-col justify-center">
        <div className="flex max-w-115 flex-col gap-3 md:gap-4">
          <h1 className="m-0 text-4xl font-bold leading-tight text-50 sm:text-5xl md:text-6xl">
            {t('travelExperience.hero.title')}
          </h1>
          <p className="m-0 text-base font-medium leading-relaxed text-50 md:text-lg">
            {t('travelExperience.hero.subtitle')}
          </p>
        </div>
      </Container>
    </section>
  )
}

export default TravelExperienceHero
