import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import heroPhoto from '../../../assets/images/our-responsibility/hero.jpg'

const ResponsibilityHero = () => {
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden h-80 sm:h-100 md:h-110 lg:h-125">
      <img
        src={heroPhoto}
        alt={t('ourResponsibility.hero.imageAlt')}
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-50/90 from-[29%] to-transparent to-[52%] rtl:bg-linear-to-l" />

      <Container className="relative flex h-full flex-col justify-center">
        <div className="flex max-w-[430px] flex-col gap-3 md:gap-4">
          <h1 className="m-0 text-4xl font-bold leading-tight text-primary-1 sm:text-5xl md:text-6xl">
            {t('ourResponsibility.hero.title')}
          </h1>
          <p className="m-0 text-sm font-normal leading-relaxed text-700 sm:text-base md:text-lg">
            {t('ourResponsibility.hero.subtitle')}
          </p>
        </div>
      </Container>
    </section>
  )
}

export default ResponsibilityHero
