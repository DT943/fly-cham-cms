import { ArrowRight, Compass, Question, Sparkle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const cards = [
  { id: 'destinations', icon: Compass, href: '/our-destinations' },
  { id: 'faqs', icon: Question, href: '/help/faqs' },
  { id: 'experiences', icon: Sparkle, href: '/help' },
]

const PlanJourney = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6">
      <h2 className="m-0 text-xl font-semibold text-700 sm:text-2xl lg:text-[28px]">
        {t('routeMap.plan.title')}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map(({ id, icon: Icon, href }) => (
          <article
            key={id}
            className="group flex flex-col gap-4 rounded-2xl border border-solid border-200 bg-50 p-6"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-1/10 text-primary-1">
              <Icon size={22} />
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <h3 className="m-0 text-lg font-semibold text-secondary-2">
                {t(`routeMap.plan.cards.${id}.title`)}
              </h3>
              <p className="m-0 text-sm leading-5 text-600">
                {t(`routeMap.plan.cards.${id}.description`)}
              </p>
            </div>
            <LocalizedLink
              href={href}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-1 no-underline transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            >
              {t(`routeMap.plan.cards.${id}.cta`)}
              <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" />
            </LocalizedLink>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PlanJourney
