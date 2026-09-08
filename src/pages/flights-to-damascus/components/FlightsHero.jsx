import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import heroPhoto from '../../../assets/images/flights-to-damascus/hero.png'

const FlightsHero = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden h-90 sm:h-100 md:h-110 lg:h-125">
      <img
        src={heroPhoto}
        alt={t('flightsToDamascus.hero.imageAlt')}
        className="absolute inset-0 size-full object-cover object-[center_35%]"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary-1 to-transparent to-[82%] rtl:bg-linear-to-l" />

      <Container className="relative flex h-full flex-col justify-center">
        <div className="flex max-w-125 flex-col gap-3 md:gap-4">
          <h1 className="m-0 text-4xl font-semibold leading-tight text-50 sm:text-5xl md:text-6xl">
            {t('flightsToDamascus.hero.title')}
          </h1>
          <p className="m-0 text-sm leading-relaxed text-50 sm:text-base">
            {t('flightsToDamascus.hero.description')}
          </p>
        </div>
      </Container>
    </section>
  )
}

export default FlightsHero
