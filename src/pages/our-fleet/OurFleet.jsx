import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import { typography } from '../../styles/typography.js'
import MediaCards from '../../shared/components/MediaCards.jsx'
import heroPhoto from '../../assets/images/our-fleet/hero.jpg'
import cargoPhoto from '../../assets/images/our-fleet/cargo.jpg'
import entertainmentPhoto from '../../assets/images/our-fleet/entertainment.jpg'
import FleetGrid from './components/FleetGrid.jsx'
import FleetFeatureSections from './components/FleetFeatureSections.jsx'

const OurFleet = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('ourFleet.breadcrumb') },
  ]

  const paragraphs = t('ourFleet.explore.paragraphs', { returnObjects: true }) || []

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <PageMediaHero
        image={heroPhoto}
        imageAlt={t('ourFleet.hero.imageAlt')}
        title={t('ourFleet.hero.title')}
        subtitle={t('ourFleet.hero.subtitle')}
        objectPosition="center 40%"
      />

      <Container className="flex flex-col gap-12 pt-10 md:gap-16 md:pt-14">
        <section className="flex flex-col gap-4">
          <h2 className={`m-0 font-semibold text-800 ${typography.sectionTitle}`}>
            {t('ourFleet.explore.title')}
          </h2>
          <div className="flex flex-col gap-4">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <FleetGrid />

        <FleetFeatureSections />

        <MediaCards
          cards={[
            {
              id: 'cargo',
              image: cargoPhoto,
              imageAlt: t('ourFleet.banners.cargo.imageAlt'),
              href: '#',
              title: t('ourFleet.banners.cargo.title'),
              description: t('ourFleet.banners.cargo.description'),
              cta: t('ourFleet.banners.learnMore'),
            },
            {
              id: 'entertainment',
              image: entertainmentPhoto,
              imageAlt: t('ourFleet.banners.entertainment.imageAlt'),
              href: '/travel-experience/onboard',
              title: t('ourFleet.banners.entertainment.title'),
              description: t('ourFleet.banners.entertainment.description'),
              cta: t('ourFleet.banners.learnMore'),
            },
          ]}
        />
      </Container>
    </main>
  )
}

export default OurFleet
