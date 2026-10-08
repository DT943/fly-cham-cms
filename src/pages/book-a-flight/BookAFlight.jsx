import { useTranslation } from 'react-i18next'
import BookingWidgetBlock from '../../cms/components/BookingWidgetBlock.jsx'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import Faqs from '../../shared/components/Faqs.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import SeatPlan from '../../shared/components/SeatPlan.jsx'

const MEDIA = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media'

const HERO_IMAGE = `${MEDIA}/our-fleet/hero.webp`

const PLAN_CARDS = [
  {
    id: 'baggage',
    href: '/travel-experience/before-you-fly/allowed-baggage',
    image: `${MEDIA}/seat-selection/plan-1.webp`,
  },
  {
    id: 'prohibited',
    href: '/travel-experience/before-you-fly/prohibited-items',
    image: `${MEDIA}/seat-selection/plan-2.webp`,
  },
  {
    id: 'seat',
    href: '/travel-experience/seat-selection',
    image: `${MEDIA}/before-you-fly/seat-selection-v2.webp`,
  },
]

// Same offset the home page gives its booking widget over the hero.
const BOOKING_WIDGET_OFFSET = -80

const BookAFlight = () => {
  const { t } = useTranslation()

  const faqItems = t('bookAFlightPage.faq.items', { returnObjects: true })
  const planItems = PLAN_CARDS.map(({ id, href, image }) => ({
    id,
    href,
    image,
    title: t(`bookAFlightPage.plan.cards.${id}.title`),
    description: t(`bookAFlightPage.plan.cards.${id}.description`),
    imageAlt: t(`bookAFlightPage.plan.cards.${id}.imageAlt`),
  }))

  return (
    <main className="w-full bg-100 pb-12 md:pb-16">
      <div className="flex flex-col gap-6 pt-5 pb-5 md:gap-8 md:pt-10 md:pb-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: t('bookAFlightPage.breadcrumbHome'), href: '/' },
              { label: t('bookAFlightPage.breadcrumb') },
            ]}
          />
        </Container>

        <PageMediaHero
          image={HERO_IMAGE}
          imageAlt={t('bookAFlightPage.hero.imageAlt')}
          title={t('bookAFlightPage.hero.title')}
          subtitle={t('bookAFlightPage.hero.subtitle')}
        />

        <Container>
          <BookingWidgetBlock offsetY={BOOKING_WIDGET_OFFSET} />
        </Container>

        <Container>
          <Faqs
            title={t('bookAFlightPage.faq.title')}
            items={Array.isArray(faqItems) ? faqItems : []}
            browseLabel={t('bookAFlightPage.faq.browse')}
            browseHref="/help/faqs"
          />
        </Container>

        <Container>
          <SeatPlan
            title={t('bookAFlightPage.plan.title')}
            description={t('bookAFlightPage.plan.description')}
            learnMore={t('bookAFlightPage.plan.learnMore')}
            items={planItems}
            buttonText="primary-1"
            buttonTextHover="background"
            learnMoreAlign="end"
          />
        </Container>
      </div>
    </main>
  )
}

export default BookAFlight
