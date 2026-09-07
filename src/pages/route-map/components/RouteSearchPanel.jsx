import { useEffect, useRef, useState } from 'react'
import { AirplaneTakeoff, ArrowRight, CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const AirportOption = ({ airport, onSelect }) => (
  <li>
    <button
      type="button"
      onClick={() => onSelect(airport.code)}
      className="flex w-full cursor-pointer items-center gap-3 border-0 border-b border-solid border-200 bg-transparent px-4 py-3 text-start transition-colors last:border-b-0 hover:bg-100"
    >
      <span className="w-12 shrink-0 rounded bg-100 py-1 text-center text-xs font-semibold text-600">
        {airport.code}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={`${typography.caption} truncate font-bold text-secondary-2`}>
          {airport.city}, {airport.country}
        </span>
        <span className={`${typography.caption} truncate text-600`}>{airport.airportName}</span>
      </span>
    </button>
  </li>
)

/** One combobox: shows the picked airport, opens a filterable airport list. */
const AirportField = ({ label, value, airports, exclude, onSelect, open, onToggle }) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const term = query.trim().toLowerCase()
  const options = airports
    .filter((airport) => airport.code !== exclude)
    .filter((airport) =>
      !term
        ? true
        : [airport.city, airport.country, airport.airportName, airport.code]
            .join(' ')
            .toLowerCase()
            .includes(term)
    )

  return (
    <div className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer flex-col items-start gap-0.5 border-0 bg-transparent px-4 py-2.5 text-start"
      >
        <span className={`${typography.caption} text-600`}>{label}</span>
        <span className="flex w-full items-center justify-between gap-2">
          <span
            className={`${typography.body} truncate font-semibold ${
              value ? 'text-secondary-2' : 'text-500'
            }`}
          >
            {value ? `${value.city} (${value.code})` : t('routeMap.search.choose')}
          </span>
          <CaretDown size={14} weight="bold" className={`shrink-0 text-600 ${open ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-solid border-200 bg-background shadow-[0_12px_32px_rgba(1,38,59,0.18)]">
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label={t('routeMap.search.label')}
            placeholder={t('routeMap.search.placeholder')}
            className={`${typography.caption} w-full border-0 border-b border-solid border-200 bg-100 px-4 py-2.5 text-800 placeholder:text-500 focus:outline-none`}
          />
          <ul className="m-0 max-h-64 list-none overflow-y-auto p-0">
            {options.map((airport) => (
              <AirportOption key={airport.code} airport={airport} onSelect={onSelect} />
            ))}
            {options.length === 0 && (
              <li className={`${typography.caption} px-4 py-3 text-600`}>
                {t('routeMap.search.empty')}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * From / To pickers with Reset and Find Flights, floating over the map — the
 * route-map search pattern: pick both ends, see the leg drawn, then open the
 * booking drawer to finish the search.
 */
const RouteSearchPanel = ({ airports, from, to, onChange, onReset, onFindFlights }) => {
  const { t } = useTranslation()
  const [openField, setOpenField] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!openField) return undefined

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpenField(null)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpenField(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openField])

  const select = (field) => (code) => {
    onChange(field, code)
    setOpenField(field === 'from' && !to ? 'to' : null)
  }

  return (
    <div ref={containerRef} className="flex w-full flex-col gap-2">
      <div className="flex items-stretch rounded-xl border border-solid border-200 bg-background shadow-[0_10px_30px_rgba(1,38,59,0.18)]">
        <AirportField
          label={t('routeMap.search.from')}
          value={from}
          airports={airports}
          exclude={to?.code}
          onSelect={select('from')}
          open={openField === 'from'}
          onToggle={() => setOpenField(openField === 'from' ? null : 'from')}
        />
        <span className="my-2 w-px shrink-0 bg-200" aria-hidden="true" />
        <AirportField
          label={t('routeMap.search.to')}
          value={to}
          airports={airports}
          exclude={from?.code}
          onSelect={select('to')}
          open={openField === 'to'}
          onToggle={() => setOpenField(openField === 'to' ? null : 'to')}
        />
      </div>

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
