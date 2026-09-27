import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

/**
 * Home trip destination card — matches home mock (New badge, price, circular CTA).
 */
const HomeTripCard = ({ id, image, href, isNew, priceFrom, currency }) => {
  const { t } = useTranslation()

  return (
    <article className="relative aspect-16/13 min-w-0 overflow-hidden rounded-xl">
      <img
        src={image}
        alt={t(`home.planTrip.destinations.${id}.imageAlt`)}
        className="absolute inset-0 size-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,38,59,0)_40%,rgba(1,38,59,0.88)_100%)]"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5 md:p-4">
        <div className="flex min-w-0 flex-col gap-1">
          {isNew ? (
            <span
              className={`w-fit rounded px-2 py-0.5 font-semibold text-700 ${typography.caption} bg-secondary`}
            >
              {t('home.planTrip.new')}
            </span>
          ) : null}
          <h3 className={`m-0 font-semibold text-50 ${typography.itemTitle}`}>
            {t(`home.planTrip.destinations.${id}.name`)}
          </h3>
          <p className={`m-0 text-50/90 ${typography.caption}`}>
            {t('home.planTrip.priceFrom', { price: priceFrom, currency })}
          </p>
        </div>

        <LocalizedLink
          href={href}
          aria-label={t('home.planTrip.explore', {
            city: t(`home.planTrip.destinations.${id}.name`),
          })}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-1 text-50 no-underline md:size-10"
        >
          <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

export default HomeTripCard
