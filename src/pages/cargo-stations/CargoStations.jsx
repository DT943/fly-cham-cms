import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import HelpCta from '../../shared/components/HelpCta.jsx'
import CargoStationsExplorer from './components/CargoStationsExplorer.jsx'
import CargoStationsRequest from './components/CargoStationsRequest.jsx'
import { cargoStationsGuide } from './utils/cargoStationsContent.js'

const CargoStations = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('cargoService.breadcrumb'), href: '/cargo-service' },
    { label: t('cargoStations.breadcrumb') },
  ]

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-100 pb-12 md:pb-16">
      <Container className="min-w-0 pt-5 pb-4 md:pt-10 md:pb-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <CargoStationsExplorer />
      <CargoStationsRequest />

      <div className="py-2 md:py-4">
        <HelpCta
          image={cargoStationsGuide.image}
          imageAlt={t('cargoStations.guide.imageAlt')}
          title={t('cargoStations.guide.title')}
          description={t('cargoStations.guide.description')}
          cta={t('cargoStations.guide.cta')}
          href={cargoStationsGuide.href}
          objectPosition={cargoStationsGuide.objectPosition}
          overlayStyle={cargoStationsGuide.overlayStyle}
        />
      </div>
    </main>
  )
}

export default CargoStations
