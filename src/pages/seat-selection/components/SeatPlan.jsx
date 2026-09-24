import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import plan1 from '../../../assets/images/seat-selection/plan-1.jpg'
import plan2 from '../../../assets/images/seat-selection/plan-2.jpg'
import plan3 from '../../../assets/images/seat-selection/plan-3.jpg'

const planCards = [
  { id: 'baggage', image: plan1, href: '/help' },
  { id: 'prohibited', image: plan2, href: '/help' },
  { id: 'minor', image: plan3, href: '/help' },
]

const SeatPlan = () => {
  const { t } = useTranslation()

  return (
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
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-50 shadow-[0px_2px_1px_rgba(33,37,41,0.06),0px_0px_0.5px_rgba(33,37,41,0.08)]"
          >
            <LocalizedLink
              href={card.href}
              className="absolute inset-0 z-1"
              aria-label={t(`seatSelection.plan.cards.${card.id}.title`)}
            />
            <img
              src={card.image}
              alt={t(`seatSelection.plan.cards.${card.id}.imageAlt`)}
              className="h-49 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none relative z-2 flex flex-1 flex-col gap-3 p-4 text-700">
              <h3 className={`m-0 font-semibold ${typography.itemTitle}`}>
                {t(`seatSelection.plan.cards.${card.id}.title`)}
              </h3>
              <p className={`m-0 flex-1 font-normal leading-relaxed ${typography.itemDescription}`}>
                {t(`seatSelection.plan.cards.${card.id}.description`)}
              </p>
              <span
                className={`group/lm pointer-events-auto relative mt-2 inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full font-semibold ${typography.button}`}
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 start-0 w-[34px] rounded-full bg-primary-1 transition-[width] duration-300 ease-out group-hover/lm:w-full"
                />
                <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
                  <ArrowRight size={16} weight="bold" className="text-50 rtl:-scale-x-100" />
                </span>
                <span className="relative z-10 pe-3 ps-2.5 text-primary-1 transition-colors duration-300 group-hover/lm:text-50">
                  {t('seatSelection.plan.learnMore')}
                </span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SeatPlan
