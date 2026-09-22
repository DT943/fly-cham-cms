import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import { typography } from '../../styles/typography.js'
import heroPhoto from '../../assets/images/travel-experience/hero.png'
import TravelExperienceCards from './components/TravelExperienceCards.jsx'
import HelpCta from '../../shared/components/HelpCta.jsx'

const TravelExperience = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelExperience.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageMediaHero
        image={heroPhoto}
        imageAlt={t('travelExperience.hero.imageAlt')}
        title={t('travelExperience.hero.title')}
        subtitle={t('travelExperience.hero.subtitle')}
        objectPosition="center 35%"
      />

      <Container className="flex flex-col gap-3 py-8 md:py-10">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
          {t('travelExperience.sectionTitle')}
        </h2>
        <p className={`m-0 font-normal text-700 ${typography.sectionDescription}`}>
          {t('travelExperience.sectionDescription')}
        </p>
      </Container>

      <TravelExperienceCards />

      <div className="pt-12 md:pt-16">
        <HelpCta />
      </div>
    </main>
  )
}

export default TravelExperience
