import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchConsole from './components/SearchConsole/index.jsx'
import HelpCategories from './components/HelpCategories.jsx'
import CtaBanner from '../../shared/components/CtaBanner.jsx'
import JourneySection from './components/JourneySection.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'

const Help = () => {
  const { t } = useTranslation()

  const helpBreadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help') },
  ]

  return (
    <main className="bg-100">
      <Container className="py-5 md:py-10 flex flex-col gap-6 md:gap-8">
        <Breadcrumbs items={helpBreadcrumbs} />
        <SearchAnchor hit="help-hero">
          <PageHero
            title={t('help.hero.title')}
            subtitle={t('help.hero.subtitle')}
          />
        </SearchAnchor>
        <SearchConsole showChips />
        <HelpCategories />
        <SearchAnchor hit="help-urgent">
          <CtaBanner
            title={t('help.urgent.title')}
            description={t('help.urgent.description')}
            cta={t('help.urgent.cta')}
          />
        </SearchAnchor>
        <JourneySection />
      </Container>
    </main>
  )
}

export default Help
