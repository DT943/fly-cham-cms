import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import { typography } from '../../styles/typography.js'
import MediaCenterHero from './components/MediaCenterHero.jsx'
import LatestNews from './components/LatestNews.jsx'
import NewsGrid from './components/NewsGrid.jsx'
import MediaMagazineBanner from './components/MediaMagazineBanner.jsx'
import MediaContactCards from './components/MediaContactCards.jsx'
import MediaNewsletterSignup from './components/MediaNewsletterSignup.jsx'

const MediaCenter = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('mediaCenter.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <MediaCenterHero
        title={t('mediaCenter.hero.title')}
        subtitle={t('mediaCenter.hero.subtitle')}
        imageAlt={t('mediaCenter.hero.imageAlt')}
      />

      <Container className="flex flex-col gap-14 pt-10 md:gap-16 md:pt-14">
        <p className={`m-0 font-normal leading-relaxed text-800 ${typography.body}`}>
          {t('mediaCenter.intro')}
        </p>

        <LatestNews />

        <NewsGrid />

        <MediaMagazineBanner />

        <MediaContactCards />

        <MediaNewsletterSignup />
      </Container>
    </main>
  )
}

export default MediaCenter
