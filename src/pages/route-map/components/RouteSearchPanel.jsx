import { AirplaneTakeoff, ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import RouteAirportPicker from './RouteAirportPicker.jsx'

/**
 * From / To pickers with Reset and Find Flights, floating over the map: pick
 * both ends, see the leg drawn, then open the booking drawer to finish. The
 * fields themselves reuse the booking box's own airport dropdown.
 */
const RouteSearchPanel = ({ from, to, onChange, onReset, onFindFlights }) => {
  const { t } = useTranslation()

  return (
    <div className="flex w-full flex-col gap-2">
      <RouteAirportPicker from={from?.code} to={to?.code} onChange={onChange} />

      {(from || to) && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className={`${typography.caption} flex-1 cursor-pointer rounded-lg border border-solid border-200 bg-background px-4 py-2.5 font-semibold text-600 transition-colors hover:border-300 hover:text-secondary-2`}
          >
            {t('routeMap.search.reset')}
          </button>

          {from && to && (
            <button
              type="button"
              onClick={onFindFlights}
              className={`${typography.caption} flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-secondary px-4 py-2.5 font-semibold text-btn transition-colors hover:bg-secondary-800`}
            >
              <AirplaneTakeoff size={16} weight="bold" className="shrink-0" />
              {t('routeMap.search.findFlights')}
              <ArrowRight size={14} weight="bold" className="shrink-0 rtl:-scale-x-100" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default RouteSearchPanel
