import { useEffect, useMemo, useRef, useState } from 'react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import { store } from '../../vendor/flycham/store/index.js'
import {
  setAirports,
  setCalendarData,
  setFormikData,
  setPos,
  setSearchParams,
} from '../../vendor/flycham/store/flightSlice.js'
import BookingBox from '../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/BookingBox.jsx'
import useBookingFormik from '../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/hooks/useBookingFormik.jsx'
import { TRIP_TYPES } from '../../vendor/flycham/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants.js'
import { getManifestFilteredAirportList } from '../../vendor/flycham/util/airports/index.js'
import { FLYCHAM_POS } from '../../vendor/shims/next-navigation.jsx'
import { FLYCHAM_SITE_URL } from '../../vendor/flycham/lib/flychamSite.js'
import '../../vendor/styles/booking-box.css'

/**
 * Fly Cham booking box, vendored from flychamwebsite's `booking-box-v2` and wired
 * the same way the live site's CMS `Widget2` wires it (bookingPreviewV2 +
 * searchV2AirportUi + enableInfantsWithSeat, round-trip by default).
 *
 * Difference from the live site: this app has no search-results page, so
 * `resultsPath` is the absolute flycham.com URL and Search leaves the SPA — the
 * `next/navigation` shim sends absolute hrefs through `window.location`.
 */

const noopModalControls = {
  openMobileModal: () => {},
  openDesktopModal: () => {},
  closeAllModals: () => {},
}

/** Booking box owns its own query cache; nothing else in this app uses react-query. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const BookingWidgetInner = ({ className = '', initialFrom, initialTo }) => {
  const dispatch = useDispatch()
  const language = useCurrentLanguage()

  const [submitted, setSubmitted] = useState(false)
  const [, setResetFn] = useState(() => () => {})
  const [, setModalControls] = useState(noopModalControls)
  const prefilledRef = useRef(null)

  // Same airport source as flycham.com's server prefetch: the B2C route matrix,
  // falling back to the bundled schedule manifest when the API is unreachable.
  const { data: flights } = useQuery({
    queryKey: ['airportList', language],
    queryFn: () => getManifestFilteredAirportList(language),
    staleTime: 5 * 60_000,
  })

  const resultsPath = useMemo(
    () => `${FLYCHAM_SITE_URL}/${FLYCHAM_POS}/${language}/search-results`,
    [language],
  )

  useEffect(() => {
    dispatch(setFormikData(null))
    dispatch(setSearchParams(null))
    dispatch(setPos(FLYCHAM_POS))
    // Live B2C routes drive availability; no legacy calendar cache to seed.
    dispatch(setCalendarData(null))
  }, [dispatch])

  useEffect(() => {
    if (flights) dispatch(setAirports(flights))
  }, [dispatch, flights])

  const formik = useBookingFormik({
    onCloseMidifySearch: () => {},
    setSubmitted,
    resultsPath,
    defaultTripType: TRIP_TYPES.RETURN,
    allowSameDayReturn: true,
  })

  /*
   * Seed the first leg when a caller hands us a route (the route map does, after
   * you pick From/To on it). The form stores airport ids, not IATA codes, so this
   * waits for the airport list and maps through it. Applied once per route so it
   * never fights the traveller's own edits.
   */
  useEffect(() => {
    if (!initialFrom && !initialTo) return

    const items = flights?.items
    if (!Array.isArray(items) || items.length === 0) return

    const key = `${initialFrom || ''}>${initialTo || ''}`
    if (prefilledRef.current === key) return

    const idFor = (code) =>
      items.find((item) => (item.iataCode || '').toUpperCase() === code)?.id

    const sourceId = initialFrom ? idFor(initialFrom) : undefined
    const destinationId = initialTo ? idFor(initialTo) : undefined
    if (sourceId === undefined && destinationId === undefined) return

    prefilledRef.current = key
    if (sourceId !== undefined) formik.setFieldValue('legs.0.source', sourceId)
    if (destinationId !== undefined) formik.setFieldValue('legs.0.destination', destinationId)
  }, [flights, initialFrom, initialTo, formik])

  return (
    <div className={className} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <BookingBox
        pos={FLYCHAM_POS}
        flights={flights}
        resultsPath={resultsPath}
        submitted={submitted}
        setSubmitted={setSubmitted}
        formik={formik}
        onRegisterReset={setResetFn}
        onRegisterModalControls={setModalControls}
        bookingPreviewV2
        searchV2AirportUi
        enableInfantsWithSeat
      />
    </div>
  )
}

const BookingWidget = (props) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <BookingWidgetInner {...props} />
    </QueryClientProvider>
  </ReduxProvider>
)

export default BookingWidget
