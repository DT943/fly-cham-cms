import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'
import { fleet } from '../utils/aircraft.js'
import aircraftImage from '../../../assets/images/our-fleet/aircraft.png'

/**
 * Grid of aircraft cards. Each card shows the model name, its Economy / Business
 * split, a side-view render, the total seat count and a circular link button.
 * All five aircraft share the same illustration, matching the design.
 */
const FleetCard = ({ aircraft }) => {
  const { t } = useTranslation()

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-200 bg-white p-5">
      <h3 className={`m-0 font-bold text-primary-1 ${typography.itemTitle}`}>{aircraft.name}</h3>

      <div className={`grid grid-cols-2 gap-2 text-700 ${typography.itemDescription}`}>
        <p className="m-0">
          {t('ourFleet.card.economy')} {aircraft.economy}
        </p>
        <p className="m-0">
          {t('ourFleet.card.business')} {aircraft.business}
        </p>
      </div>

      <img
        src={aircraftImage}
        alt={t('ourFleet.card.imageAlt')}
        className="my-2 h-24 w-full object-contain md:h-28"
      />

      <div className="flex items-center justify-between gap-3">
        <p className={`m-0 font-semibold text-800 ${typography.itemTitle}`}>
          {t('ourFleet.card.totalSeats')} {aircraft.totalSeats}
        </p>
        <LocalizedLink
          href="#"
          aria-label={t('ourFleet.card.viewLabel', { name: aircraft.name })}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-1 text-white transition-colors hover:bg-primary-700"
        >
          <ArrowRight size={20} weight="bold" className="rtl:-scale-x-100" />
        </LocalizedLink>
      </div>
    </article>
  )
}

const FleetGrid = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {fleet.map((aircraft) => (
      <FleetCard key={aircraft.id} aircraft={aircraft} />
    ))}
  </div>
)

export default FleetGrid
