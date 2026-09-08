import { X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import RouteAirportPicker from './RouteAirportPicker.jsx'

/**
 * From / To pickers floating over the map, with a clear (×) beside them. Find
 * Flights now lives on the destination card, so this panel is just the pickers.
 */
const RouteSearchPanel = ({ from, to, onChange, onReset }) => {
  const { t } = useTranslation()

  return (
    <div className="flex w-full items-stretch gap-2">
      <div className="min-w-0 flex-1">
        <RouteAirportPicker from={from?.code} to={to?.code} onChange={onChange} />
      </div>

      {(from || to) && (
        <button
          type="button"
          onClick={onReset}
          aria-label={t('routeMap.search.reset')}
          className="grid w-12 shrink-0 cursor-pointer place-items-center rounded-xl border border-solid border-200 bg-background text-600 shadow-[0_10px_30px_rgba(1,38,59,0.18)] transition-colors hover:text-secondary-2"
        >
          <X size={18} weight="bold" />
        </button>
      )}
    </div>
  )
}

export default RouteSearchPanel
