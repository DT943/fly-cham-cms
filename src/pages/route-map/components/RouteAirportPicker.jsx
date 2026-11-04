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
import { airportsByCode } from '../utils/routeNetwork.js'

/** Its own cache, matching how BookingWidget isolates the booking box. */
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
})

const FIELD = { from: 'source', to: 'destination' }

const PickerInner = ({
  from,
  to,
  onChange,
  onReset,
  onSearch,
  searching = false,
  cityImages = {},
}) => {
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

  const thumbFor = (code) => {
    const airport = airportsByCode[code]
    return airport ? cityImages?.[airport.cityKey] || '' : ''
  }

  const renderField = (field) => {
    const isOpen = openField === field
    const code = value(field)
    const selected = items?.find((item) => (item.iataCode || '').toUpperCase() === code)
    const city = selected?.airPortTranslations?.[0]?.city
    const thumb = code ? thumbFor(code) : ''

    return (
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={code ? `${label(field)} ${city || code} (${code})` : label(field)}
        onClick={() => {
          setSearch('')
          setOpenField(isOpen ? null : field)
        }}
        className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 border-0 bg-transparent px-3 py-2.5 text-start ${
          code ? '' : ''
        }`}
      >
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="size-8 shrink-0 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-100 text-[10px] font-semibold uppercase text-600">
            {code || '—'}
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <span className={`${typography.caption} text-600`}>{label(field)}</span>
          <span className="flex w-full items-center justify-between gap-1.5">
            <span className={`${typography.body} truncate font-semibold text-secondary-2`}>
              {code ? city || code : t('routeMap.search.select')}
            </span>
            <CaretDown
              size={14}
              weight="bold"
              className={`shrink-0 text-secondary-2 ${isOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-stretch gap-2 rounded-2xl border border-solid border-200 bg-background p-2 shadow-[0_8px_24px_rgba(1,38,59,0.08)] sm:flex-nowrap sm:gap-0 sm:p-0">
        <div className="flex min-w-0 flex-1 items-stretch rounded-xl border border-solid border-200 bg-background sm:rounded-none sm:border-0">
          {renderField('from')}
          <span className="my-2 w-px shrink-0 bg-200" aria-hidden="true" />
          {renderField('to')}
        </div>

        <div className="flex w-full items-center gap-3 px-1 sm:w-auto sm:shrink-0 sm:px-3">
          <button
            type="button"
            onClick={() => {
              setOpenField(null)
              onSearch?.()
            }}
            disabled={!canSearch || searching}
            className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-lg border-0 bg-primary-1 px-5 py-2.5 text-sm font-medium text-50 transition-colors hover:bg-primary-1/90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            {t('routeMap.search.search')}
          </button>
          {onReset && (from || to) ? (
            <button
              type="button"
              onClick={() => {
                setOpenField(null)
                onReset()
              }}
              className="cursor-pointer border-0 bg-transparent px-1 py-2 text-sm font-medium text-primary-1 underline-offset-2 transition-colors hover:underline"
            >
              {t('routeMap.search.reset')}
            </button>
          ) : null}
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
