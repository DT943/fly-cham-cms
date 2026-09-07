import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import SearchAnchor from '../../shared/search/components/SearchAnchor.jsx'
import CitySightsHero from './components/CitySightsHero.jsx'
import SightsCategories from './components/SightsCategories.jsx'
import SightsGrid from './components/SightsGrid.jsx'
import MagazineBanner from './components/MagazineBanner.jsx'
import NewsletterSignup from './components/NewsletterSignup.jsx'

const CitySights = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly'), href: '/our-destinations' },
    { label: t('citySights.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <SearchAnchor hit="city-sights-hero">
        <CitySightsHero />
      </SearchAnchor>

      <Container className="flex flex-col gap-10 py-8 md:gap-14 md:py-12 lg:gap-14 lg:py-14">
        <SightsCategories />
        <SearchAnchor hit="city-sights-grid">
          <SightsGrid />
        </SearchAnchor>
        <MagazineBanner />
        <NewsletterSignup />
      </Container>
    </main>
  )
}

export default CitySights
