import { useEffect, useMemo, useState } from 'react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { AirplaneLanding, AirplaneTakeoff, CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { store } from '../../../vendor/flycham/store/index.js'
import { setAirports } from '../../../vendor/flycham/store/flightSlice.js'
import AirportDropdownPanel from '../../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/components/AirportDropdownPanel.jsx'
import { useAirportState } from '../../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/hooks/useAirportState.jsx'
import { TRIP_TYPES } from '../../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants.js'
import { getManifestFilteredAirportList } from '../../../vendor/flycham/util/airports/index.js'

/** Its own cache, matching how BookingWidget isolates the booking box. */
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
})

const FIELD = { from: 'source', to: 'destination' }

const PickerInner = ({ from, to, onChange, onReset, onSearch, searching = false }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const language = useCurrentLanguage()

  const [openField, setOpenField] = useState(null)
  const [search, setSearch] = useState('')

  const { data: airports } = useQuery({
    queryKey: ['airportList', language],
    queryFn: () => getManifestFilteredAirportList(language),
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    if (airports) dispatch(setAirports(airports))
  }, [dispatch, airports])

  const items = airports?.items
  const idFor = (code) =>
    items?.find((item) => (item.iataCode || '').toUpperCase() === code)?.id ?? ''
  const codeFor = (id) =>
    (items?.find((item) => String(item.id) === String(id))?.iataCode || '').toUpperCase()

  const panelValues = useMemo(
    () => ({
      source: idFor(from),
      destination: idFor(to),
      tripType: TRIP_TYPES.RETURN,
      nearby: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [from, to, items],
  )

  const formik = useMemo(
    () => ({
      values: {
        legs: [{ source: panelValues.source, destination: panelValues.destination, dateStart: '' }],
        tripType: TRIP_TYPES.RETURN,
      },
      setFieldValue: () => {},
    }),
    [panelValues],
  )

  const { getCitiesArray } = useAirportState({ formik, airports })

  const setFieldValue = (field, value) => {
    if (field !== 'source' && field !== 'destination') return
    const code = codeFor(value)
    if (!code) return
    onChange(field === 'source' ? 'from' : 'to', code)
    setSearch('')
    setOpenField(null)
  }

  const label = (field) => (field === 'from' ? t('routeMap.search.from') : t('routeMap.search.to'))
  const value = (field) => (field === 'from' ? from : to)
  const canSearch = Boolean(from && to)

  const renderField = (field) => {
    const isOpen = openField === field
    const code = value(field)
    const selected = items?.find((item) => (item.iataCode || '').toUpperCase() === code)
    const city = selected?.airPortTranslations?.[0]?.city
    const FieldIcon = field === 'from' ? AirplaneTakeoff : AirplaneLanding

    return (
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-600">{label(field)}</span>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={code ? `${label(field)} ${city || code}` : label(field)}
          onClick={() => {
            setSearch('')
            setOpenField(isOpen ? null : field)
          }}
          className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-xl border border-solid border-[#E0E0DE] bg-50 px-2.5 text-start shadow-none outline-none transition-colors hover:border-[#C9C9C6]"
        >
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary-3 text-50">
            <FieldIcon size={13} weight="fill" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#4A4A4A]">
            {code ? city || code : t('routeMap.search.select')}
          </span>
          <CaretDown
            size={12}
            weight="regular"
            className={`shrink-0 text-[#6B6B6B] transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </div>
    )
  }

  const resetButton = onReset ? (
    <button
      type="button"
      onClick={() => {
        setOpenField(null)
        onReset()
      }}
      className="cursor-pointer border-0 bg-transparent px-0.5 py-1.5 text-sm font-medium text-secondary-1 underline underline-offset-2 transition-opacity hover:opacity-80"
    >
      {t('routeMap.search.reset')}
    </button>
  ) : null

  return (
    <div className="relative">
      <div className="flex flex-col gap-3 rounded-2xl bg-background p-4 shadow-[0_8px_28px_rgba(1,38,59,0.12)] md:flex-row md:items-end md:gap-3 md:p-5">
        <div className="flex min-w-0 flex-1 items-end gap-2.5 md:contents">
          {renderField('from')}
          {renderField('to')}
        </div>

        {/* Mobile: Reset centered under the fields (no Search). */}
        {resetButton ? <div className="flex justify-center md:hidden">{resetButton}</div> : null}

        {/* Desktop: Search + Reset beside the fields. */}
        <div className="hidden shrink-0 items-center gap-3 pb-0.5 md:flex md:ps-1">
          <button
            type="button"
            onClick={() => {
              setOpenField(null)
              onSearch?.()
            }}
            disabled={!canSearch || searching}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border-0 bg-primary-1 px-5 text-sm font-semibold text-50 transition-colors hover:bg-primary-1/90 disabled:cursor-not-allowed disabled:bg-300 disabled:text-500 disabled:opacity-100 md:min-w-24"
          >
            {t('routeMap.search.search')}
          </button>
          {resetButton}
        </div>
      </div>

      {openField && (
        <div className="route-map-airports absolute start-0 top-full z-20 mt-1 w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-solid border-200 bg-background shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:w-[min(44rem,calc(100vw-2.5rem))]">
          <AirportDropdownPanel
            isOpen
            fieldType={FIELD[openField]}
            searchValue={search}
            setSearchValue={setSearch}
            handleSearchOverride={(event) => setSearch(event?.target?.value ?? '')}
            valuesOverride={panelValues}
            setFieldValueOverride={setFieldValue}
            setOpenAirPortsDropdownOverride={() => setOpenField(null)}
            getCitiesArray={getCitiesArray}
            airportItems={items || []}
            searchV2AirportUi
          />
        </div>
      )}
    </div>
  )
}

/** From / To pickers that reuse the booking box's own airport dropdown. */
const RouteAirportPicker = (props) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <PickerInner {...props} />
    </QueryClientProvider>
  </ReduxProvider>
)

export default RouteAirportPicker
