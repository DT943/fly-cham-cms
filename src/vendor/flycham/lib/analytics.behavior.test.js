import { ANALYTICS_EVENTS, pushAnalyticsEvent } from '@/lib/analytics'
import {
  clearBookingAnalyticsContext,
  getBookingAnalyticsContext,
  replaceSearchAnalyticsContext,
  setBookingAnalyticsContext,
  buildSearchContextFromFormValues,
} from '@/lib/bookingAnalyticsContext'
import {
  resetBookingFlowDedupeForTests,
  trackBookingTicketDownloadClarityEvent,
  trackFlightSelectionAcceptedClarityEvent,
  trackPassengerInfoFieldClarityEvent,
  trackPaymentGatewayFailedClarityEvent,
  trackPaymentGatewaySuccessClarityEvent,
  trackSearchApiEmptyClarityEvent,
  trackSearchApiFailedClarityEvent,
  trackSearchApiSuccessClarityEvent,
  trackSearchFlightsClarityEvent,
} from '@/lib/clarity'
import { emitValidatedSearchNavigation, releaseSearchSubmissionLock, resetSearchSubmissionForTests } from '@/lib/searchSubmission'
import {
  resetCmsAnalyticsForTests,
  trackHelpSearch,
  trackNewsletterAttempt,
  trackPageView,
} from '../../../shared/analytics/cmsEvents.js'

function installBrowser({ consented = true, path = '/sy/en/help' } = {}) {
  const store = new Map()
  if (consented) store.set('flycham_cookie_banner_dismissed', 'accepted')
  globalThis.window = {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
    location: {
      pathname: path,
      origin: 'http://localhost',
      href: `http://localhost${path}`,
    },
    dataLayer: [],
  }
  globalThis.document = { title: 'Help', referrer: 'https://example.com/from?token=secret' }
}

const searchValues = {
  tripType: 'Return',
  cabinClass: 'Economy',
  legs: [{ source: 11, destination: 4, dateStart: '2026-11-01' }],
  dateEnd: '2026-11-08',
  adults: 1,
  children: 0,
  infants: 0,
  infantsWithSeat: 0,
  nearby: false,
  promoCode: 'SECRET',
  email: 'a@b.com',
}

function resetState(options) {
  installBrowser(options)
  clearBookingAnalyticsContext()
  resetSearchSubmissionForTests()
  resetBookingFlowDedupeForTests()
  resetCmsAnalyticsForTests()
}

export async function runAnalyticsBehaviorTests({ assert, test }) {
  const expect = (actual) => ({
    toBe(expected) {
      assert.equal(actual, expected)
    },
    toEqual(expected) {
      assert.deepEqual(actual, expected)
    },
    toHaveLength(expected) {
      assert.equal(actual.length, expected)
    },
    toBeUndefined() {
      assert.equal(actual, undefined)
    },
    toBeTruthy() {
      assert.ok(actual)
    },
    toContain(expected) {
      assert.ok(actual.includes(expected))
    },
    not: {
      toContain(expected) {
        assert.equal(actual.includes(expected), false)
      },
    },
  })

  await test('does not push while consent is denied and does not consume a page view', () => {
    resetState({ consented: false })
    installBrowser({ consented: false })
    expect(trackPageView({ navigationKey: 'nav-1' })).toBe(false)
    expect(window.dataLayer).toEqual([])
    window.localStorage.setItem('flycham_cookie_banner_dismissed', 'accepted')
    expect(trackPageView({ navigationKey: 'nav-1', pageTitle: 'Help' })).toBe(true)
    expect(window.dataLayer.filter((entry) => entry.event === 'page_view')).toHaveLength(1)
    expect(trackPageView({ navigationKey: 'nav-1' })).toBe(false)
    expect(window.dataLayer.filter((entry) => entry.event === 'page_view')).toHaveLength(1)
  })

  await test('emits one page view per committed navigation and a new one for back/forward', () => {
    resetState()
    trackPageView({ navigationKey: 'a:/help' })
    trackPageView({ navigationKey: 'a:/help' })
    trackPageView({ navigationKey: 'b:/help' })
    const views = window.dataLayer.filter((entry) => entry.event === 'page_view')
    expect(views).toHaveLength(2)
    expect(views[0].page_path).toBe('/help')
    expect(views[0].lang).toBe('en')
    expect(views[0].pos).toBe('sy')
    expect(views[0].page_referrer).toBe('https://example.com/from')
    expect(JSON.stringify(views[0])).not.toContain('token')
  })

  await test('counts one accepted search attempt and keeps the stages separate', () => {
    resetState()
    const first = trackSearchFlightsClarityEvent(searchValues)
    const second = trackSearchFlightsClarityEvent(searchValues)
    expect(first.accepted).toBe(true)
    expect(second.accepted).toBe(false)
    emitValidatedSearchNavigation({
      href: 'https://flycham.com/gb/en/search-results?token=abc',
      external: true,
    })
    const names = window.dataLayer.map((entry) => entry.event)
    expect(names.filter((name) => name === 'booking_search_submitted')).toHaveLength(1)
    expect(names.filter((name) => name === 'flight_search')).toHaveLength(1)
    expect(names.filter((name) => name === 'outbound_search')).toHaveLength(1)
    expect(names.filter((name) => name === 'booking_search_flights')).toHaveLength(1)
    const attemptIds = new Set(
      window.dataLayer.map((entry) => entry.search_attempt_id).filter(Boolean),
    )
    expect(attemptIds.size).toBe(1)
    const outbound = window.dataLayer.find((entry) => entry.event === 'outbound_search')
    expect(outbound.destination_host).toBe('flycham.com')
    expect(outbound.results_path).toBe('/gb/en/search-results')
    expect(outbound.results_path).not.toContain('token')
    const submitted = window.dataLayer.find((entry) => entry.event === 'booking_search_submitted')
    expect(submitted.origin_iata).toBe('DAM')
    expect(submitted.destination_iata).toBe('DXB')
    expect(submitted.return_date).toBe('2026-11-08')
    expect(submitted.email).toBeUndefined()
    expect(submitted.promo_code).toBeUndefined()
  })

  await test('allows a genuine retry after the in-flight lock is released', () => {
    resetState()
    trackSearchFlightsClarityEvent(searchValues)
    releaseSearchSubmissionLock()
    resetSearchSubmissionForTests()
    trackSearchFlightsClarityEvent({ ...searchValues, tripType: 'OneWay', dateEnd: '2026-12-01' })
    const submitted = window.dataLayer.filter((entry) => entry.event === 'booking_search_submitted')
    expect(submitted).toHaveLength(2)
    expect(submitted[1].return_date).toBeUndefined()
    expect(getBookingAnalyticsContext().return_date).toBeUndefined()
  })

  await test('does not emit booking_search_flights for multi-city', () => {
    resetState()
    trackSearchFlightsClarityEvent({
      ...searchValues,
      tripType: 'MultiCity',
      legs: [
        { source: 11, destination: 4, dateStart: '2026-11-01' },
        { source: 4, destination: 11, dateStart: '2026-11-08' },
      ],
    })
    expect(window.dataLayer.map((entry) => entry.event)).toContain('booking_search_submitted')
    expect(window.dataLayer.map((entry) => entry.event)).not.toContain('booking_search_flights')
  })

  await test('emits one flight selection and does not also emit a fare', () => {
    resetState()
    trackFlightSelectionAcceptedClarityEvent({
      cabinType: 'Economy',
      fareTier: 'smart',
      originIata: 'DAM',
      pnr: 'ABC123',
    })
    const selected = window.dataLayer.filter((entry) => entry.event === 'booking_flight_selected')
    expect(selected).toHaveLength(1)
    expect(selected[0].event_action).toBe('api_success')
    expect(window.dataLayer.some((entry) => entry.event === 'booking_fare_selected')).toBe(false)
    expect(selected[0].pnr).toBeUndefined()
    expect(selected[0].booking_reference).toBeUndefined()
  })

  await test('emits one availability outcome per request and ignores a repeated callback', () => {
    resetState()
    trackSearchApiFailedClarityEvent({ requestId: 'req-1', errorKind: 'http', statusCode: 500 })
    trackSearchApiSuccessClarityEvent({ requestId: 'req-1', flightCount: 2 })
    expect(window.dataLayer.filter((entry) => String(entry.event).startsWith('booking_search_api_'))).toHaveLength(1)
    expect(window.dataLayer[0].event).toBe('booking_search_api_failed')

    trackSearchApiEmptyClarityEvent({ requestId: 'req-2' })
    trackSearchApiSuccessClarityEvent({ requestId: 'req-3', flightCount: 4, email: 'a@b.com' })
    const events = window.dataLayer.map((entry) => entry.event)
    expect(events).toContain('booking_search_api_empty')
    expect(events.filter((name) => name === 'booking_search_api_success')).toHaveLength(1)
    expect(window.dataLayer.some((entry) => entry.email)).toBe(false)
  })

  await test('does not treat a transient payment error or a repeated success as another outcome', () => {
    resetState()
    trackPaymentGatewayFailedClarityEvent({
      paymentAttemptId: 'pay-1',
      errorKind: 'timeout',
      paymentSessionId: 'sess-secret',
    })
    expect(window.dataLayer).toEqual([])
    trackPaymentGatewaySuccessClarityEvent({
      paymentAttemptId: 'pay-1',
      pnr: 'ABC123',
      paymentSessionId: 'sess-secret',
    })
    trackPaymentGatewaySuccessClarityEvent({ paymentAttemptId: 'pay-1', authoritative: true })
    const outcomes = window.dataLayer.map((entry) => entry.event)
    expect(outcomes).toEqual(['booking_payment_gateway_success'])
    expect(window.dataLayer[0].pnr).toBeUndefined()
    expect(window.dataLayer[0].payment_session_id).toBeUndefined()
    expect(window.dataLayer[0].booking_reference).toBeUndefined()
  })

  await test('keeps download phases distinct and newsletter payloads free of email and booking context', () => {
    resetState()
    setBookingAnalyticsContext({ origin_iata: 'DAM', email: 'a@b.com', booking_reference: 'PNR1' })
    trackBookingTicketDownloadClarityEvent({ phase: 'started', downloadAttemptId: 'dl-1', withPrice: false })
    trackBookingTicketDownloadClarityEvent({ phase: 'started', downloadAttemptId: 'dl-1' })
    trackBookingTicketDownloadClarityEvent({ phase: 'success', downloadAttemptId: 'dl-1', withPrice: true })
    const downloads = window.dataLayer.filter((entry) => entry.event === 'booking_ticket_download')
    expect(downloads.map((entry) => entry.event_action)).toEqual(['started', 'success'])

    trackNewsletterAttempt({ formLocation: 'newsletter_signup', formId: 'newsletter-signup' })
    const newsletter = window.dataLayer.find((entry) => entry.event === ANALYTICS_EVENTS.NEWSLETTER_SUBMITTED)
    expect(newsletter.event_action).toBe('attempt')
    expect(newsletter.event_category).toBe('marketing')
    expect(newsletter.origin_iata).toBeUndefined()
    expect(newsletter.email).toBeUndefined()
    expect(newsletter.booking_reference).toBeUndefined()
    expect(newsletter.submit_attempt_id).toBeTruthy()
  })

  await test('records a committed help search without the query text', () => {
    resetState()
    const pushed = trackHelpSearch({ queryLength: 12, hasResults: true })
    expect(pushed).toBe(true)
    pushAnalyticsEvent(ANALYTICS_EVENTS.HELP_SEARCH, { query: 'passport renewal', query_length: 4 })
    expect(window.dataLayer.every((entry) => entry.query == null)).toBe(true)
    expect(window.dataLayer[0].query_length).toBe(12)
  })

  await test('tracks one passenger field edit per passenger and field', () => {
    resetState()
    trackPassengerInfoFieldClarityEvent('first_name', { passengerIndex: 0 })
    trackPassengerInfoFieldClarityEvent('first_name', { passengerIndex: 0 })
    trackPassengerInfoFieldClarityEvent('first_name', { passengerIndex: 1 })
    const edits = window.dataLayer.filter((entry) => entry.event === 'booking_passenger_field_edited')
    expect(edits).toHaveLength(2)
    expect(window.dataLayer.some((entry) => entry.event === 'booking_funnel_step')).toBe(true)
    expect(edits[0].field_name).toBe('first_name')
  })

  await test('drops a stale return date when the search context is replaced with one-way', () => {
    resetState()
    replaceSearchAnalyticsContext(buildSearchContextFromFormValues(searchValues))
    replaceSearchAnalyticsContext(
      buildSearchContextFromFormValues({ ...searchValues, tripType: 'OneWay', dateEnd: '2026-12-01' }),
    )
    expect(getBookingAnalyticsContext().return_date).toBeUndefined()
    expect(getBookingAnalyticsContext().trip_type).toBe('OneWay')
  })
}
