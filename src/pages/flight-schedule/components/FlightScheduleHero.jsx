import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'

const HERO_IMAGE =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/travel-updates/hero.webp'

const FlightScheduleHero = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate h-64 overflow-hidden sm:h-72 md:h-80">
      <img
        src={HERO_IMAGE}
        alt={t('flightSchedulePage.hero.imageAlt')}
        className="absolute inset-0 size-full object-cover object-right"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(253_253_252/0.95)_25%,rgb(253_253_252/0.55)_45%,rgb(253_253_252/0)_65%)] rtl:bg-[linear-gradient(to_left,rgb(253_253_252/0.95)_25%,rgb(253_253_252/0.55)_45%,rgb(253_253_252/0)_65%)]"
        aria-hidden
      />
      <Container className="relative flex h-full flex-col justify-center pb-10">
        <h1 className="m-0 text-4xl leading-tight font-bold text-primary-1 md:text-5xl">
          {t('flightSchedulePage.title')}
        </h1>
        <p className="m-0 mt-2 text-sm text-700">{t('flightSchedulePage.hero.subtitle')}</p>
      </Container>
    </section>
  )
}

export default FlightScheduleHero
