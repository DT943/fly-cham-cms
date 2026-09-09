import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import { typography } from '../../styles/typography.js'
import TravelExperienceHero from './components/TravelExperienceHero.jsx'
import TravelExperienceStages from './components/TravelExperienceStages.jsx'
import TravelExperienceHelpCta from './components/TravelExperienceHelpCta.jsx'

const TravelExperience = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelExperience.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <TravelExperienceHero />

      <Container className="py-8 md:py-10">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
          {t('travelExperience.sectionTitle')}
        </h2>
      </Container>

      <TravelExperienceStages />

      <TravelExperienceHelpCta />
    </main>
  )
}

export default TravelExperience
