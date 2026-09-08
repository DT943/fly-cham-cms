import { useEffect, useMemo, useState } from 'react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { typography } from '../../../styles/typography.js'
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

const PickerInner = ({ from, to, onChange }) => {
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

  // AirportList reads the catalogue straight off the store.
  useEffect(() => {
    if (airports) dispatch(setAirports(airports))
  }, [dispatch, airports])

  const items = airports?.items
  const idFor = (code) =>
    items?.find((item) => (item.iataCode || '').toUpperCase() === code)?.id ?? ''
  const codeFor = (id) =>
    (items?.find((item) => String(item.id) === String(id))?.iataCode || '').toUpperCase()

  /*
   * The dropdown works in airport ids, and takes two different shapes: the panel
   * reads a flat { source, destination } view of one leg, while useAirportState
   * reads formik's nested legs[]. Build both from the map's From/To and convert
   * back to IATA on selection — nothing here touches the real booking form.
   */
  const panelValues = useMemo(
    () => ({
      source: idFor(from),
      destination: idFor(to),
      tripType: TRIP_TYPES.RETURN,
      nearby: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [from, to, items]
  )

  const formik = useMemo(
    () => ({
      values: {
        legs: [{ source: panelValues.source, destination: panelValues.destination, dateStart: '' }],
        tripType: TRIP_TYPES.RETURN,
      },
      setFieldValue: () => {},
    }),
    [panelValues]
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

  const renderField = (field, align) => {
    const isOpen = openField === field
    const code = value(field)
    const selected = items?.find((item) => (item.iataCode || '').toUpperCase() === code)
    const city = selected?.airPortTranslations?.[0]?.city

    return (
      <div className="relative min-w-0 flex-1">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => {
            setSearch('')
            setOpenField(isOpen ? null : field)
          }}
          className="flex w-full cursor-pointer flex-col items-start gap-0.5 border-0 bg-transparent px-4 py-2.5 text-start"
        >
          <span className={`${typography.caption} text-600`}>{label(field)}</span>
          <span className="flex w-full items-center justify-between gap-2">
            <span
              className={`${typography.body} truncate font-semibold ${
                code ? 'text-secondary-2' : 'text-500'
              }`}
            >
              {code ? `${city || code} (${code})` : t('routeMap.search.choose')}
            </span>
            <CaretDown
              size={14}
              weight="bold"
              className={`shrink-0 text-600 ${isOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>

        {isOpen && (
          <div
            className={`route-map-airports absolute top-full z-20 mt-1 w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-solid border-200 bg-background shadow-[0_12px_32px_rgba(1,38,59,0.18)] sm:w-[min(44rem,calc(100vw-2.5rem))] ${
              align === 'end' ? 'end-0' : 'start-0'
            }`}
          >
            <AirportDropdownPanel
              isOpen
              fieldType={FIELD[field]}
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

  return (
    <div className="flex items-stretch rounded-xl border border-solid border-200 bg-background shadow-[0_10px_30px_rgba(1,38,59,0.18)]">
      {renderField('from', 'start')}
      <span className="my-2 w-px shrink-0 bg-200" aria-hidden="true" />
      {renderField('to', 'end')}
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
