import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import {
  setAirports,
  setCalendarData,
  setFormikData,
  setPos,
  setSearchParams,
} from '../../vendor/flycham/store/flightSlice.js'
import useBookingFormik from '../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/hooks/useBookingFormik.jsx'
import { useAirportState } from '../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/hooks/useAirportState.jsx'
import useGuestsReducer from '../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/hooks/useGuestsReducer.jsx'
import {
  AIRPORT_TYPES,
  TRIP_TYPES,
} from '../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants.js'
import { getManifestFilteredAirportList } from '../../vendor/flycham/util/airports/index.js'
import { useBookingPreviewV2AllRoutes } from '../../vendor/flycham/lib/b2cAvailability/useBookingPreviewV2AllRoutes.js'
import { fetchB2cFlightAvailByRoute } from '../../vendor/flycham/lib/b2cAvailability/b2cAvailabilityApi.js'
import { mapFlightAvailToScheduleRows } from '../../vendor/flycham/lib/b2cAvailability/mapFlightAvailToScheduleRows.js'
import { FLYCHAM_POS } from '../../vendor/shims/next-navigation.jsx'
import { FLYCHAM_SITE_URL } from '../../vendor/flycham/lib/flychamSite.js'
import { toDateKey } from './CalendarPanel.jsx'

const BOOKING_WINDOW_DAYS = 360

/** "Damascus, DAM" (Arabic comma in Arabic) — a route field's value and option label. */
export const airportLabel = (airport, lang = 'en') => {
  if (!airport) return ''
  const t = airport.airPortTranslations?.[0] || {}
  return `${t.city || t.airPortName || airport.iataCode}${lang === 'ar' ? '، ' : ', '}${airport.iataCode}`
}

/** Days with flights on one route, from the B2C availability API. */
const useRouteDays = (from, to, lang) => {
  const query = useQuery({
    queryKey: ['booking-search-route-days', from, to, lang],
    queryFn: async () => {
      const rows = await fetchB2cFlightAvailByRoute(from, to, lang)
      return mapFlightAvailToScheduleRows(rows, from, to).map((row) => row.flightTimes.slice(0, 10))
    },
    enabled: Boolean(from && to),
    staleTime: 10 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
  return {
    // null = no restriction (no route yet, or the API failed).
    days: query.isSuccess ? new Set(query.data) : null,
    loading: Boolean(from && to) && query.isLoading,
  }
}

/**
 * State + actions for the Offers & Deals booking box. Uses the vendored
 * flycham.com booking engine for everything that matters to a search — the
 * form + submit (useBookingFormik → flycham.com search results), the airport
 * list and served-route filtering (useAirportState), passenger rules
 * (useGuestsReducer) and live day availability — and only owns the UI state.
 */
export default function useBookingSearch({ language, labels }) {
  const dispatch = useDispatch()
  const [, setSubmitted] = useState(false)
  const [open, setOpen] = useState(null)
  const [calendarTarget, setCalendarTarget] = useState('start')
  const [invalid, setInvalid] = useState(null)
  const [searching, setSearching] = useState(false)
  const [miles, setMiles] = useState(false)

  const { data: airports } = useQuery({
    queryKey: ['airportList', language],
    queryFn: () => getManifestFilteredAirportList(language),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })
  const { routeRows } = useBookingPreviewV2AllRoutes(true)

  useEffect(() => {
    dispatch(setFormikData(null))
    dispatch(setSearchParams(null))
    dispatch(setPos(FLYCHAM_POS))
    dispatch(setCalendarData(null))
  }, [dispatch])

  useEffect(() => {
    if (airports) dispatch(setAirports(airports))
  }, [dispatch, airports])

  // Back from flycham.com restores this page from the bfcache mid-"Searching".
  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) setSearching(false)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const resultsPath = `${FLYCHAM_SITE_URL}/${FLYCHAM_POS}/${language}/search-results`
  const formik = useBookingFormik({
    setSubmitted,
    resultsPath,
    defaultTripType: TRIP_TYPES.RETURN,
    allowSameDayReturn: true,
  })
  const { values, setFieldValue } = formik

  const { getCitiesArray } = useAirportState({
    formik,
    airports,
    b2cRouteRows: routeRows,
    b2cRoutesPending: routeRows == null,
  })
  const { guestsState, changeGuestCount, setCabinClass } = useGuestsReducer(formik)

  const items = useMemo(() => (Array.isArray(airports?.items) ? airports.items : []), [airports])
  const byId = useCallback((id) => items.find((item) => item.id === id), [items])
  const iataOf = useCallback((id) => byId(id)?.iataCode || '', [byId])

  const tripType = values.tripType || TRIP_TYPES.RETURN
  const isReturn = tripType === TRIP_TYPES.RETURN
  const isMultiCity = tripType === TRIP_TYPES.MULTICITY
  const legs = Array.isArray(values.legs) ? values.legs : []
  const leg = (index) => legs[index] || { source: '', destination: '', dateStart: '' }

  // Preselect the CMS default origin (e.g. DAM) once the airport list arrives.
  const defaultOriginApplied = useRef(false)
  useEffect(() => {
    if (defaultOriginApplied.current || !items.length) return
    defaultOriginApplied.current = true
    const code = String(labels.defaultOrigin || '').toUpperCase()
    if (!code || leg(0).source) return
    const id = items.find((item) => (item.iataCode || '').toUpperCase() === code)?.id
    if (id !== undefined) setFieldValue('legs.0.source', id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Figma shows "Include nearby airports" ticked by default. Kept here and
  // synced into the engine's form, which re-initialises after mount.
  const [nearby, setNearby] = useState(true)
  useEffect(() => {
    if (Boolean(values.nearby) !== nearby) setFieldValue('nearby', nearby)
  }, [values.nearby, nearby, setFieldValue])

  const close = useCallback(() => setOpen(null), [])
  const toggle = useCallback((name) => setOpen((current) => (current === name ? null : name)), [])

  // ——— Airports (shared Dropdown fields) ———
  const idPrefix = useId()
  /** DOM id of a field's Dropdown button, e.g. "from-0". */
  const fieldId = (name) => `${idPrefix}-${name}`
  /** Open an airport Dropdown from code (it owns its open state, so press its button). */
  const openField = (name) => {
    setOpen(null)
    window.requestAnimationFrame(() => document.getElementById(fieldId(name))?.click())
  }

  /** `{ value, label }` options for one airport field, limited to served routes. */
  const airportChoices = (legIndex, type) => {
    let list
    if (legIndex === 1) {
      const opts = { multiCityLegIndex: 1, tripType: TRIP_TYPES.MULTICITY, formikValues: values }
      list = type === AIRPORT_TYPES.SOURCE
        ? getCitiesArray(AIRPORT_TYPES.SOURCE, null, '', opts)
        : getCitiesArray(AIRPORT_TYPES.DESTINATION, iataOf(leg(1).source), '', opts)
    } else {
      list = type === AIRPORT_TYPES.SOURCE
        ? getCitiesArray(AIRPORT_TYPES.SOURCE, null, '')
        : getCitiesArray(AIRPORT_TYPES.DESTINATION, iataOf(leg(0).source), '')
    }
    return (list || []).map((airport) => ({ value: airport.id, label: airportLabel(airport, language) }))
  }

  const selectAirport = (legIndex, type, id) => {
    setInvalid(null)
    if (type === AIRPORT_TYPES.SOURCE) {
      setFieldValue(`legs.${legIndex}.source`, id)
      // A new origin can change the served destinations — drop a stale one.
      const destination = leg(legIndex).destination
      if (destination === id) setFieldValue(`legs.${legIndex}.destination`, '')
      if (!destination || destination === id) openField(`to-${legIndex}`)
      return
    }
    setFieldValue(`legs.${legIndex}.destination`, id)
    if (legIndex === 0 && isMultiCity && !leg(1).source) setFieldValue('legs.1.source', id)
    setCalendarTarget('start')
    setOpen(`date-${legIndex}`)
  }

  const clearAirport = (legIndex, type) => {
    setFieldValue(`legs.${legIndex}.${type === AIRPORT_TYPES.SOURCE ? 'source' : 'destination'}`, '')
  }

  const swap = (legIndex = 0) => {
    const { source, destination } = leg(legIndex)
    setFieldValue(`legs.${legIndex}.source`, destination || '')
    setFieldValue(`legs.${legIndex}.destination`, source || '')
  }

  const airportText = (id) => airportLabel(byId(id), language)

  // ——— Trip type ———
  const setTripType = (type) => {
    setInvalid(null)
    setFieldValue('tripType', type)
    if (type !== TRIP_TYPES.RETURN) setFieldValue('dateEnd', '')
    if (type === TRIP_TYPES.MULTICITY && !leg(1).source && leg(0).destination) {
      setFieldValue('legs.1.source', leg(0).destination)
    }
  }

  // ——— Dates ———
  const today = new Date()
  const minKey = toDateKey(today)
  const maxKey = toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + BOOKING_WINDOW_DAYS))
  const outbound = useRouteDays(iataOf(leg(0).source), iataOf(leg(0).destination), language)
  const inbound = useRouteDays(isReturn ? iataOf(leg(0).destination) : '', isReturn ? iataOf(leg(0).source) : '', language)
  const leg2Days = useRouteDays(isMultiCity ? iataOf(leg(1).source) : '', isMultiCity ? iataOf(leg(1).destination) : '', language)

  const openDates = (legIndex, target = 'start') => {
    setCalendarTarget(target === 'end' && !leg(0).dateStart ? 'start' : target)
    setOpen(`date-${legIndex}`)
  }

  const calendarFor = (legIndex) => {
    if (legIndex === 1) {
      return {
        start: leg(1).dateStart || '',
        minKey: leg(0).dateStart || minKey,
        available: leg2Days.days,
        loading: leg2Days.loading,
        range: false,
      }
    }
    const pickingEnd = isReturn && calendarTarget === 'end'
    return {
      start: leg(0).dateStart || '',
      end: values.dateEnd || '',
      range: isReturn,
      minKey: pickingEnd ? leg(0).dateStart || minKey : minKey,
      available: pickingEnd ? inbound.days : outbound.days,
      loading: pickingEnd ? inbound.loading : outbound.loading,
    }
  }

  const selectDate = (legIndex, key) => {
    setInvalid(null)
    if (legIndex === 1) {
      setFieldValue('legs.1.dateStart', key)
      close()
      return
    }
    if (isReturn && calendarTarget === 'end' && leg(0).dateStart && key >= leg(0).dateStart) {
      setFieldValue('dateEnd', key)
      setCalendarTarget('start')
      close()
      return
    }
    setFieldValue('legs.0.dateStart', key)
    setFieldValue('dateStart', key)
    if (isReturn) {
      if (values.dateEnd && values.dateEnd < key) setFieldValue('dateEnd', '')
      setCalendarTarget('end')
      return
    }
    if (isMultiCity && leg(1).dateStart && leg(1).dateStart < key) setFieldValue('legs.1.dateStart', '')
    close()
  }

  // ——— Search ———
  const firstMissing = () => {
    const l0 = leg(0)
    if (!l0.source) return 'from-0'
    if (!l0.destination) return 'to-0'
    if (!l0.dateStart) return 'date-0'
    if (isReturn && !values.dateEnd) return 'return-0'
    if (isMultiCity) {
      const l1 = leg(1)
      if (!l1.source) return 'from-1'
      if (!l1.destination) return 'to-1'
      if (!l1.dateStart) return 'date-1'
    }
    return null
  }

  const search = async () => {
    const missing = firstMissing()
    if (missing) {
      setInvalid(missing)
      if (missing === 'return-0') openDates(0, 'end')
      else if (missing.startsWith('date')) openDates(Number(missing.slice(-1)), 'start')
      else openField(missing)
      return
    }
    setSearching(true)
    close()
    const navigating = await formik.handleSearchSubmit()
    if (!navigating) setSearching(false)
  }

  return {
    values,
    tripType,
    isReturn,
    isMultiCity,
    leg,
    open,
    setOpen,
    toggle,
    close,
    invalid,
    calendarTarget,
    fieldId,
    airportChoices,
    selectAirport,
    clearAirport,
    swap,
    airportText,
    setTripType,
    openDates,
    calendarFor,
    selectDate,
    minKey,
    maxKey,
    guests: guestsState,
    changeGuestCount,
    setCabinClass,
    nearby,
    toggleNearby: () => setNearby((current) => !current),
    miles,
    toggleMiles: () => {
      setMiles((current) => !current)
      setFieldValue('miles', !miles)
    },
    searching,
    search,
  }
}
