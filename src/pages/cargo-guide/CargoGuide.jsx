import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import { typography } from '../../styles/typography.js'
import CargoGuideFlipbook from './components/CargoGuideFlipbook.jsx'
import cover from '../../assets/images/cargo-guide/page-01.jpg'
import whoWeAre from '../../assets/images/cargo-guide/page-02.jpg'
import fleet from '../../assets/images/cargo-guide/page-03.jpg'
import cargoDepartment from '../../assets/images/cargo-guide/page-04.jpg'
import destinations from '../../assets/images/cargo-guide/page-05.jpg'
import cargoTypesAr from '../../assets/images/cargo-guide/page-06.jpg'
import cargoTypesEn from '../../assets/images/cargo-guide/page-07.jpg'
import services from '../../assets/images/cargo-guide/page-08.jpg'
import backCover from '../../assets/images/cargo-guide/page-09.jpg'

const SPREADS = [whoWeAre, fleet, cargoDepartment, destinations, cargoTypesAr, cargoTypesEn, services]

/** Brochure in reading order: cover, each spread as its left + right page, back cover. */
const PAGES = [
  { src: cover, hard: true },
  ...SPREADS.flatMap((src) => [
    { src, side: 'left' },
    { src, side: 'right' },
  ]),
  { src: backCover, hard: true },
]

const CargoGuide = () => {
  const { t } = useTranslation()

  return (
    <main className="w-full bg-100 pb-12 md:pb-20">
      <Container className="pt-5 md:pt-10">
        <Breadcrumbs
          items={[
            { label: t('cargoGuide.breadcrumbHome'), href: '/' },
            { label: t('cargoGuide.breadcrumbCargo'), href: '/cargo' },
            { label: t('cargoGuide.title') },
          ]}
        />

        <header className="mt-6 flex flex-col gap-3 md:mt-8">
          <h1 className={`m-0 font-bold leading-tight text-primary-1 lg:text-[44px] ${typography.pageTitle}`}>
            {t('cargoGuide.title')}
          </h1>
          <p className="m-0 max-w-180 text-base text-700 md:text-lg">{t('cargoGuide.description')}</p>
        </header>

        <section className="mt-4 md:mt-6">
          <CargoGuideFlipbook pages={PAGES} />
        </section>
      </Container>
    </main>
  )
}

export default CargoGuide
