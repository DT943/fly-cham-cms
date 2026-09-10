import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import { typography } from '../../styles/typography.js'
import BeforeYouFlyHero from './components/BeforeYouFlyHero.jsx'
import BeforeYouFlyServices from './components/BeforeYouFlyServices.jsx'

const BeforeYouFly = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelExperience.breadcrumb'), href: '/travel-experience' },
    { label: t('beforeYouFly.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <BeforeYouFlyHero />

      <Container className="flex flex-col gap-2 py-8 md:py-10">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
          {t('beforeYouFly.sectionTitle')}
        </h2>
        <p className={`m-0 font-normal text-700 ${typography.sectionDescription}`}>
          {t('beforeYouFly.sectionDescription')}
        </p>
      </Container>

      <BeforeYouFlyServices />
    </main>
  )
}

export default BeforeYouFly
