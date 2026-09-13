import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import { typography } from '../../styles/typography.js'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import { withLanguage } from '../../i18n/languages.js'
import BeforeYouFlyServices from './components/BeforeYouFlyServices.jsx'
import JourneyStageNextSteps from './components/JourneyStageNextSteps.jsx'
import { getJourneyStage, getJourneyStageSlug } from './utils/journeyStages.js'

const BeforeYouFly = () => {
  const { t } = useTranslation()
  const { pagePath, language } = useLocalizedRoute()
  const slug = getJourneyStageSlug(pagePath)
  const stage = getJourneyStage(slug)

  if (!stage) {
    return <Navigate to={withLanguage('/travel-experience', language)} replace />
  }

  const { i18nKey, heroImage, services, nextSteps } = stage
  const sectionTitle = t(`${i18nKey}.sectionTitle`)
  const sectionDescription = t(`${i18nKey}.sectionDescription`)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelExperience.breadcrumb'), href: '/travel-experience' },
    { label: t(`${i18nKey}.breadcrumb`) },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <PageMediaHero
        image={heroImage}
        imageAlt={t(`${i18nKey}.hero.imageAlt`)}
        title={t(`${i18nKey}.hero.title`)}
        subtitle={t(`${i18nKey}.hero.subtitle`)}
      />

      {sectionTitle || sectionDescription ? (
        <Container className="flex flex-col gap-2 py-8 md:py-10">
          {sectionTitle ? (
            <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
              {sectionTitle}
            </h2>
          ) : null}
          {sectionDescription ? (
            <p className={`m-0 font-normal text-700 ${typography.sectionDescription}`}>
              {sectionDescription}
            </p>
          ) : null}
        </Container>
      ) : null}

      <div className={sectionTitle || sectionDescription ? undefined : 'pt-8 md:pt-10'}>
        <BeforeYouFlyServices i18nKey={i18nKey} services={services} />
      </div>
      <JourneyStageNextSteps i18nKey={i18nKey} items={nextSteps} />
    </main>
  )
}

export default BeforeYouFly
