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
  )
}

export default SeatPlan
