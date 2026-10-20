/**
 * CMS analytics events. All pushes go through src/vendor/flycham/lib/analytics.js.
 */
import { destinations } from '../../pages/our-destinations/utils/destinations.js'
import {
  ANALYTICS_EVENTS,
  appOwnsPageView,
  createSubmitAttemptId,
  isAnalyticsConsented,
  pushAnalyticsEvent,
  updateGoogleConsent,
} from '../../vendor/flycham/lib/analytics.js'

let lastPageViewKey = null
let lastRouteKey = ''
const destinationViews = new Set()

export function resetCmsAnalyticsForTests() {
  lastPageViewKey = null
  lastRouteKey = ''
  destinationViews.clear()
}

export function trackPageView({ navigationKey, pageTitle } = {}) {
  if (!appOwnsPageView()) return false
  if (!isAnalyticsConsented()) return false
  const key = navigationKey || 'initial'
  if (key === lastPageViewKey) return false
  const pushed = pushAnalyticsEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
    event_action: 'view',
    ...(pageTitle ? { page_title: pageTitle } : {}),
  })
  if (pushed) lastPageViewKey = key
  return pushed
}

export function trackCookieConsent(action) {
  return pushAnalyticsEvent(ANALYTICS_EVENTS.COOKIE_CONSENT, {
    event_action: action,
  })
}

/** Align Google consent with stored acceptance. Does not emit cookie_consent. */
export function syncGrantedGoogleConsent() {
  if (!isAnalyticsConsented()) return
  updateGoogleConsent(true)
}

export function grantAnalyticsConsent() {
  updateGoogleConsent(true)
  trackCookieConsent('accepted')
}

export function trackLanguageChanged(fromLang, toLang) {
  if (!fromLang || !toLang || fromLang === toLang) return false
  return pushAnalyticsEvent(ANALYTICS_EVENTS.LANGUAGE_CHANGED, {
    event_action: 'changed',
    from_lang: fromLang,
    to_lang: toLang,
  })
}

export function trackDealSelected(deal = {}, fareLabel) {
  const route = Array.isArray(deal.routes) ? deal.routes.find((item) => item?.from || item?.to) : null
  const iata = (value) => {
    const code = String(value || '').trim().toUpperCase()
    return /^[A-Z]{3}$/.test(code) ? code : undefined
  }
  const origin = iata(deal.originIata || deal.origin) || iata(route?.from)
  const destination = iata(deal.destinationIata || deal.destination) || iata(route?.to)
  const dealId = deal.id || [origin, destination, fareLabel].filter(Boolean).join('-')
  return pushAnalyticsEvent(ANALYTICS_EVENTS.DEAL_SELECTED, {
    event_action: 'selected',
    deal_id: dealId || undefined,
    origin_iata: origin,
    destination_iata: destination,
    fare_label: fareLabel || deal.fareText || undefined,
  })
}

/** Observed submit only. A timer or animation is not result=success. */
export function trackNewsletterAttempt({ formLocation, formId } = {}) {
  return pushAnalyticsEvent(ANALYTICS_EVENTS.NEWSLETTER_SUBMITTED, {
    event_action: 'attempt',
    form_location: formLocation,
    form_id: formId,
    submit_attempt_id: createSubmitAttemptId(),
  })
}

export function trackContactSubmitted(params = {}) {
  return pushAnalyticsEvent(ANALYTICS_EVENTS.CONTACT_SUBMITTED, params)
}

export function trackHelpSearch({ queryLength = 0, hasResults } = {}) {
  return pushAnalyticsEvent(ANALYTICS_EVENTS.HELP_SEARCH, {
    event_action: 'search',
    query_length: Number(queryLength) || 0,
    ...(hasResults == null ? {} : { has_results: Boolean(hasResults) }),
  })
}

export function trackScheduleSearch({ originIata, destinationIata, travelDate } = {}) {
  return pushAnalyticsEvent(ANALYTICS_EVENTS.SCHEDULE_SEARCH, {
    event_action: 'search',
    origin_iata: originIata,
    destination_iata: destinationIata,
    travel_date: travelDate,
  })
}

export function trackRouteSelected(originIata, destinationIata) {
  if (!originIata || !destinationIata) return false
  const key = `${originIata}>${destinationIata}`
  if (key === lastRouteKey) return false
  if (!isAnalyticsConsented()) return false
  const pushed = pushAnalyticsEvent(ANALYTICS_EVENTS.ROUTE_SELECTED, {
    event_action: 'selected',
    origin_iata: originIata,
    destination_iata: destinationIata,
  })
  if (pushed) lastRouteKey = key
  return pushed
}

export function resetRouteSelectionAnalytics() {
  lastRouteKey = ''
}

export function destinationAnalyticsFromPath(pagePath = '') {
  const flights = String(pagePath).match(/\/our-destinations\/flights-to-([^/]+)/)
  const guide = String(pagePath).match(/\/our-destinations\/things-to-do-in-([^/]+)/)
  const slug = flights?.[1] || guide?.[1]
  if (!slug) return null
  const row = destinations.find(
    (item) => item.id?.toLowerCase() === slug.toLowerCase() || item.href?.endsWith(slug),
  )
  return {
    destination_slug: slug,
    destination_iata: row?.iata,
  }
}

export function trackDestinationView({ slug, iata, navigationKey } = {}) {
  if (!slug) return false
  const key = `${navigationKey || 'view'}:${slug}`
  if (destinationViews.has(key)) return false
  if (!isAnalyticsConsented()) return false
  const pushed = pushAnalyticsEvent(ANALYTICS_EVENTS.DESTINATION_VIEW, {
    event_action: 'view',
    destination_slug: slug,
    destination_iata: iata,
  })
  if (pushed) destinationViews.add(key)
  return pushed
}

export function trackChamMilesRegister({ eventAction, result, submitAttemptId, formLocation } = {}) {
  return pushAnalyticsEvent(ANALYTICS_EVENTS.CHAM_MILES_REGISTER, {
    event_action: eventAction,
    result,
    submit_attempt_id: submitAttemptId,
    form_location: formLocation,
  })
}

export { createSubmitAttemptId }
