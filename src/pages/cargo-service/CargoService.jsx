import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import HelpCta from '../../shared/components/HelpCta.jsx'
import CargoInfoCards from './components/CargoInfoCards.jsx'
import CargoFaqs from './components/CargoFaqs.jsx'
import { cargoServiceHero, cargoGuideCta } from './utils/cargoServiceContent.js'

const CargoService = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('cargoService.breadcrumb') },
  ]

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-100 pb-12 md:pb-16">
      <Container className="min-w-0 pt-5 pb-4 md:pt-10 md:pb-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageMediaHero
        image={cargoServiceHero.image}
        imageAlt={t('cargoService.hero.imageAlt')}
        title={t('cargoService.hero.title')}
        subtitle={t('cargoService.hero.subtitle')}
        objectPosition={cargoServiceHero.objectPosition}
      />

      <CargoInfoCards />

      <div className="py-2 md:py-4">
        <HelpCta
          image={cargoGuideCta.image}
          imageAlt={t('cargoService.guide.imageAlt')}
          title={t('cargoService.guide.title')}
          description={t('cargoService.guide.description')}
          cta={t('cargoService.guide.cta')}
          href={cargoGuideCta.href}
          objectPosition={cargoGuideCta.objectPosition}
          overlayStyle={cargoGuideCta.overlayStyle}
        />
      </div>

      <CargoFaqs />
    </main>
  )
}

export default CargoService
