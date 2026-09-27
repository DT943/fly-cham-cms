import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import BusinessServices from './components/BusinessServices.jsx'
import BusinessEnquiry from './components/BusinessEnquiry.jsx'
import BusinessQuickAccess from './components/BusinessQuickAccess.jsx'
import { businessCenterHero } from './utils/businessCenterContent.js'

const BusinessCenter = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('businessCenter.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full min-w-0 overflow-x-clip pb-12 md:pb-16">
      <Container className="min-w-0 pt-5 pb-4 md:pt-10 md:pb-6">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageMediaHero
        image={businessCenterHero.image}
        imageAlt={t('businessCenter.hero.imageAlt')}
        title={t('businessCenter.hero.title')}
        subtitle={t('businessCenter.hero.subtitle')}
        objectPosition={businessCenterHero.objectPosition}
      />

      <BusinessServices />
      <BusinessEnquiry />
      <BusinessQuickAccess />
    </main>
  )
}

export default BusinessCenter
