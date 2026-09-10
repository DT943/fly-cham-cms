import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import heroPhoto from '../../../assets/images/before-you-fly/hero.png'

const BeforeYouFlyHero = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden h-90 sm:h-100 md:h-110 lg:h-125">
      <img
        src={heroPhoto}
        alt={t('beforeYouFly.hero.imageAlt')}
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-50/90 from-[29%] to-transparent to-[45%] rtl:bg-linear-to-l" />

      <Container className="relative flex h-full flex-col justify-center">
        <div className="flex max-w-[430px] flex-col gap-3 md:gap-4">
          <h1 className="m-0 text-4xl font-bold leading-tight text-primary-1 sm:text-5xl md:text-6xl">
            {t('beforeYouFly.hero.title')}
          </h1>
          <p className="m-0 max-w-[336px] text-sm font-normal leading-relaxed text-700 sm:text-base">
            {t('beforeYouFly.hero.subtitle')}
          </p>
        </div>
      </Container>
    </section>
  )
}

export default BeforeYouFlyHero
