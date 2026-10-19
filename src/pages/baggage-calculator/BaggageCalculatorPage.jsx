import { useTranslation } from 'react-i18next'
import BaggageCalculator from '../../shared/components/BaggageCalculator.jsx'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import Faqs from '../../shared/components/Faqs.jsx'
import InfoAccordion from '../../shared/components/InfoAccordion.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import PromoBanner from '../../shared/components/PromoBanner.jsx'
import TitleWithList from '../../shared/components/TitleWithList.jsx'

const HERO_IMAGE = '/baggage-calculator/hero.png'
const EXTRA_IMAGE = '/baggage-calculator/extra.png'

const asList = (value) => (Array.isArray(value) ? value : [])

const optionsFrom = (record) =>
  Object.entries(record && typeof record === 'object' ? record : {}).map(([value, label]) => ({
    value,
    label,
  }))

/**
 * Baggage Calculator page (Figma 40814:21591). Composed from the same sections
 * used on the other travel pages: hero, calculator card, notes, promo, FAQs,
 * and the terms accordion.
 */
const BaggageCalculatorPage = () => {
  const { t } = useTranslation()
  const calc = t('baggageCalculator', { returnObjects: true }) || {}
  const page = t('baggageCalculatorPage', { returnObjects: true }) || {}
  const faqItems = asList(page.faq?.items)
  const infoItems = asList(page.info?.items)

  return (
    <main className="w-full bg-100 pb-12 md:pb-16">
      <div className="flex flex-col gap-8 pt-5 md:gap-[60px] md:pt-10">
        <Breadcrumbs
          items={[
            { label: page.breadcrumbHome, href: '/' },
            { label: page.breadcrumbTravel, href: '/travel-experience' },
            { label: page.breadcrumbBefore, href: '/travel-experience/before-you-fly' },
            { label: page.breadcrumb },
          ]}
        />

        <PageMediaHero
          image={HERO_IMAGE}
          imageAlt={page.hero?.imageAlt}
          title={page.hero?.title}
          subtitle={page.hero?.subtitle}
          objectPosition="center right"
          contentClassName="max-w-[491px]"
          showButton={false}
          titleSize="default"
        />

        <Container>
          <BaggageCalculator
            intro={calc.intro}
            fromLabel={calc.fromLabel}
            toLabel={calc.toLabel}
            classLabel={calc.classLabel}
            tierLabel={calc.tierLabel}
            fromPlaceholder={calc.fromPlaceholder}
            toPlaceholder={calc.toPlaceholder}
            classPlaceholder={calc.classPlaceholder}
            tierPlaceholder={calc.tierPlaceholder}
            defaultFrom="DAM"
            defaultTo="DXB"
            defaultClass="economy"
            airports={optionsFrom(calc.airports)}
            classes={optionsFrom(calc.classes)}
            tiers={optionsFrom(calc.tiers)}
            buttonLabel={calc.buttonLabel}
            buttonIcon="Calculator"
            buttonHref="/travel-experience/before-you-fly/allowed-baggage"
            noteText={calc.noteText}
            noteLinkLabel={calc.noteLinkLabel}
            noteLinkHref="/travel-experience/before-you-fly/manage-booking"
          />
        </Container>

        <Container>
          <TitleWithList
            icon="Info"
            title={page.info?.title}
            items={infoItems.map((text, index) => ({ id: `info-${index}`, text }))}
            bulletColor="secondary"
          />
        </Container>

        <Container>
          <PromoBanner
            title={page.promo?.title}
            description={page.promo?.description}
            cta={page.promo?.cta}
            href="/travel-experience/before-you-fly/allowed-baggage"
            image={EXTRA_IMAGE}
            imageAlt={page.promo?.imageAlt}
            bannerHeight="feature"
            bannerRadius="full"
            objectPosition="center 35%"
            overlayColor="#01263B"
            buttonBg="secondary"
            buttonText="700"
            buttonTextFontWeight="semibold"
            showButtonIcon={false}
            sectionPadding="none"
          />
        </Container>

        <Container>
          <Faqs
            title={page.faq?.title}
            items={faqItems.map((item, index) => ({ id: `faq-${index}`, ...item }))}
            browseLabel={page.faq?.browse}
            browseHref="/help/faqs"
            titleColor="primary-1"
            questionColor="main-dark"
            sectionPadding="none"
            itemGap="default"
          />
        </Container>

        <Container>
          <InfoAccordion
            title={page.terms?.termsTitle}
            sectionPadding="none"
            cardRadius="sm"
            listMarker="dots"
            items={[
              { id: 'terms', heading: page.terms?.termsHeading, text: page.terms?.termsBody },
              { id: 'more', heading: page.terms?.moreTitle, text: page.terms?.moreBody },
            ].filter((item) => item.heading || item.text)}
          />
        </Container>
      </div>
    </main>
  )
}

export default BaggageCalculatorPage
