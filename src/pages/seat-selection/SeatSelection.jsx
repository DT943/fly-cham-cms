import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CaretDown } from '@phosphor-icons/react'
import Container from '../../shared/components/Container.jsx'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import LocalizedLink from '../../shared/components/LocalizedLink.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import { typography } from '../../styles/typography.js'
import heroPhoto from '../../assets/images/seat-selection/hero.jpg'
import journeyPhoto from '../../assets/images/seat-selection/journey.jpg'
import choose1 from '../../assets/images/seat-selection/choose-1.jpg'
import choose2 from '../../assets/images/seat-selection/choose-2.jpg'
import choose3 from '../../assets/images/seat-selection/choose-3.jpg'
import choose4 from '../../assets/images/seat-selection/choose-4.jpg'
import plan1 from '../../assets/images/seat-selection/plan-1.jpg'
import plan2 from '../../assets/images/seat-selection/plan-2.jpg'
import plan3 from '../../assets/images/seat-selection/plan-3.jpg'

const chooseCards = [
  { id: 'bookingFlight', image: choose1, href: '/' },
  { id: 'manageBooking', image: choose2, href: '/help' },
  { id: 'loyalty', image: choose3, href: '/help' },
  { id: 'salesOffices', image: choose4, href: '/help/contact-us/our-offices' },
]

const planCards = [
  { id: 'baggage', image: plan1, href: '/help' },
  { id: 'prohibited', image: plan2, href: '/help' },
  { id: 'minor', image: plan3, href: '/help' },
]

const SeatSelection = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('travelExperience.breadcrumb'), href: '/travel-experience' },
    { label: t('seatSelection.breadcrumb') },
  ]

  const faqItems = t('seatSelection.faq.items', { returnObjects: true }) || []

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <PageMediaHero
        image={heroPhoto}
        imageAlt={t('seatSelection.hero.imageAlt')}
        title={t('seatSelection.hero.title')}
        subtitle={t('seatSelection.hero.subtitle')}
        objectPosition="center"
      />

      <Container className="flex flex-col gap-14 pt-10 md:gap-16 md:pt-14">
        {/* Your Journey Begins Here */}
        <section className="flex flex-col items-center gap-8 lg:flex-row lg:gap-[105px]">
          <div className="flex flex-col gap-4 text-700 lg:max-w-[508px] lg:gap-5">
            <h2 className={`m-0 font-semibold ${typography.sectionTitle}`}>
              {t('seatSelection.journey.title')}
            </h2>
            <p className={`m-0 font-normal leading-relaxed ${typography.sectionDescription}`}>
              {t('seatSelection.journey.description')}
            </p>
          </div>
          <div className="w-full overflow-hidden rounded-3xl lg:w-[615px] lg:shrink-0">
            <img
              src={journeyPhoto}
              alt={t('seatSelection.journey.imageAlt')}
              className="aspect-[615/375] w-full object-cover"
            />
          </div>
        </section>

        {/* How Do You Choose Your Preferred Seat? */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 text-700">
            <h2 className={`m-0 font-semibold ${typography.sectionTitle}`}>
              {t('seatSelection.choose.title')}
            </h2>
            <p className={`m-0 font-normal ${typography.sectionDescription}`}>
              {t('seatSelection.choose.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {chooseCards.map((card) => (
              <LocalizedLink
                key={card.id}
                href={card.href}
                className="group relative flex h-96 flex-col justify-end overflow-hidden rounded-2xl"
              >
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent from-[25%] to-secondary-2" />
                <div className="relative flex flex-col gap-3 p-5 text-50">
                  <h3 className={`m-0 font-semibold ${typography.itemTitle}`}>
                    {t(`seatSelection.choose.cards.${card.id}.title`)}
                  </h3>
                  <p className={`m-0 font-normal ${typography.itemDescription}`}>
                    {t(`seatSelection.choose.cards.${card.id}.description`)}
                  </p>
                  <span className={`mt-1 inline-flex items-center gap-2 font-semibold text-primary-3 ${typography.button}`}>
                    {t(`seatSelection.choose.cards.${card.id}.cta`)}
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    />
                  </span>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </section>

        {/* Plan for Your Trip */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 text-700">
            <h2 className={`m-0 font-semibold ${typography.sectionTitle}`}>
              {t('seatSelection.plan.title')}
            </h2>
            <p className={`m-0 font-normal ${typography.sectionDescription}`}>
              {t('seatSelection.plan.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {planCards.map((card) => (
              <article
                key={card.id}
                className="flex flex-col overflow-hidden rounded-xl bg-50 shadow-[0px_2px_1px_rgba(33,37,41,0.06),0px_0px_0.5px_rgba(33,37,41,0.08)]"
              >
                <img
                  src={card.image}
                  alt={t(`seatSelection.plan.cards.${card.id}.imageAlt`)}
                  className="h-49 w-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-3 p-4 text-700">
                  <h3 className={`m-0 font-semibold ${typography.itemTitle}`}>
                    {t(`seatSelection.plan.cards.${card.id}.title`)}
                  </h3>
                  <p className={`m-0 flex-1 font-normal leading-relaxed ${typography.itemDescription}`}>
                    {t(`seatSelection.plan.cards.${card.id}.description`)}
                  </p>
                  <LocalizedLink
                    href={card.href}
                    className={`mt-2 inline-flex items-center gap-2 font-semibold text-primary-1 ${typography.button}`}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-1 text-50">
                      <ArrowRight size={18} weight="bold" className="rtl:rotate-180" />
                    </span>
                    {t('seatSelection.plan.learnMore')}
                  </LocalizedLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-7">
          <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
            {t('seatSelection.faq.title')}
          </h2>
          <div className="flex flex-col items-center gap-9">
            <div className="flex w-full flex-col gap-4">
              {faqItems.map((question, i) => (
                <FaqItem
                  key={question}
                  question={question}
                  answer={t('seatSelection.faq.answerPlaceholder')}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
            <LocalizedLink
              href="/help/faqs"
              className={`flex h-14 min-w-[214px] items-center justify-center rounded-lg bg-primary-2 px-6 font-semibold text-50 transition-opacity hover:opacity-90 ${typography.button}`}
            >
              {t('seatSelection.faq.browse')}
            </LocalizedLink>
          </div>
        </section>
      </Container>
    </main>
  )
}

const FaqItem = ({ question, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="w-full overflow-hidden rounded-xl border border-200 bg-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
      >
        <span className={`font-medium text-secondary-2 ${typography.itemTitle}`}>{question}</span>
        <CaretDown
          size={22}
          className={`shrink-0 text-primary-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className={`m-0 px-6 pb-5 leading-relaxed text-600 ${typography.itemDescription}`}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection
