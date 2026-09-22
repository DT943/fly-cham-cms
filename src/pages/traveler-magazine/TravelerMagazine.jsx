import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import MarhabaIntro from './components/MarhabaIntro.jsx'
import ExploreMarhaba from './components/ExploreMarhaba.jsx'
import heroImage from '../../assets/images/traveler-magazine/hero.jpg'

const TravelerMagazine = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelExperience.breadcrumb'), href: '/travel-experience' },
    { label: t('travelerMagazine.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

      <PageMediaHero
        image={heroImage}
        imageAlt={t('travelerMagazine.hero.imageAlt')}
        title={t('travelerMagazine.hero.title')}
        subtitle={t('travelerMagazine.hero.subtitle')}
      />

      <Container className="flex flex-col gap-12 pt-10 md:gap-16 md:pt-14">
        <MarhabaIntro />
        <ExploreMarhaba />
      </Container>
    </main>
  )
}

export default TravelerMagazine
