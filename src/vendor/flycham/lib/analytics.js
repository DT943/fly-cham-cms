/**
 * GTM-first booking analytics.
 * App pushes to window.dataLayer; GTM distributes to GA4 + Clarity.
 * Do not call gtag() or Clarity.event() from feature code.
 */

import { getBookingAnalyticsContext } from '@/lib/bookingAnalyticsContext';
import { getLanguageFromPath, getPosFromPath, stripLanguage } from '../../../i18n/languages.js';
import {
  allowsBookingContext,
  categoryForEvent,
  pickEventParams,
} from '@/lib/analyticsPolicy';

/** Matches `useCookiesBanner` / CookieConsentProvider storage key. */
export const COOKIES_BANNER_KEY = 'flycham_cookie_banner_dismissed';

/** Canonical GTM / GA4 event names (snake_case). */
export const ANALYTICS_EVENTS = {
  FLIGHT_SEARCH: 'flight_search',
  BOOKING_SEARCH_SUBMITTED: 'booking_search_submitted',
  BOOKING_SEARCH_FLIGHTS: 'booking_search_flights',
  MODIFY_SEARCH: 'modify_search',
  BOOKING_TRIP_TYPE_SELECTED: 'booking_trip_type_selected',
  BOOKING_TAB_SELECTED: 'booking_tab_selected',
  BOOKING_AIRPORT_SELECTED: 'booking_airport_selected',
  BOOKING_CABIN_CLASS_SELECTED: 'booking_cabin_class_selected',
  BOOKING_DATE_SELECTED: 'booking_date_selected',
  BOOKING_PASSENGER_COUNT_CHANGED: 'booking_passenger_count_changed',
  BOOKING_FLIGHT_SELECTED: 'booking_flight_selected',
  BOOKING_FARE_SELECTED: 'booking_fare_selected',
  BOOKING_NEARBY_AIRPORTS_ENABLED: 'booking_nearby_airports_enabled',
  BOOKING_FUNNEL_STEP: 'booking_funnel_step',
  BOOKING_PASSENGER_FIELD_EDITED: 'booking_passenger_field_edited',
  BOOKING_ANCILLARY_LOADED: 'booking_ancillary_loaded',
  BOOKING_SEAT_INTERACTION: 'booking_seat_interaction',
  BOOKING_BAGGAGE_INTERACTION: 'booking_baggage_interaction',
  BOOKING_ANCILLARY_PAGE_VIEW: 'booking_ancillary_page_view',
  BOOKING_WHEELCHAIR_INTERACTION: 'booking_wheelchair_interaction',
  BOOKING_LOUNGE_INTERACTION: 'booking_lounge_interaction',
  BOOKING_PAYMENT_SUBMIT: 'booking_payment_submit',
  BOOKING_CONFIRM_VIEW: 'booking_confirm_view',
  BOOKING_SEARCH_API_SUCCESS: 'booking_search_api_success',
  BOOKING_SEARCH_API_FAILED: 'booking_search_api_failed',
  BOOKING_SEARCH_API_EMPTY: 'booking_search_api_empty',
  BOOKING_SEARCH_RESULTS_VIEW: 'booking_search_results_view',
  BOOKING_PASSENGER_INFO_FAILED: 'booking_passenger_info_failed',
  BOOKING_PAYMENT_STEP_VIEW: 'booking_payment_step_view',
  BOOKING_PAYMENT_METHOD_SELECTED: 'booking_payment_method_selected',
  BOOKING_PAYMENT_TERMS_ACCEPTED: 'booking_payment_terms_accepted',
  BOOKING_PAYMENT_EXTERNAL_REDIRECT: 'booking_payment_external_redirect',
  BOOKING_PAYMENT_RETURN_CALLBACK: 'booking_payment_return_callback',
  BOOKING_PAYMENT_GATEWAY_SUCCESS: 'booking_payment_gateway_success',
  BOOKING_PAYMENT_GATEWAY_FAILED: 'booking_payment_gateway_failed',
  BOOKING_PAYMENT_CANCELLED: 'booking_payment_cancelled',
  BOOKING_POST_PAYMENT_CREATION_FAILED: 'booking_post_payment_creation_failed',
  BOOKING_SESSION_EXPIRED: 'booking_session_expired',
  BOOKING_VIEW_TICKET_OPENED: 'booking_view_ticket_opened',
  BOOKING_TICKET_DOWNLOAD: 'booking_ticket_download',
  BOOKING_TICKET_LANGUAGE_CHANGED: 'booking_ticket_language_changed',
  PAGE_VIEW: 'page_view',
  COOKIE_CONSENT: 'cookie_consent',
  LANGUAGE_CHANGED: 'language_changed',
  OUTBOUND_SEARCH: 'outbound_search',
  DEAL_SELECTED: 'deal_selected',
  NEWSLETTER_SUBMITTED: 'newsletter_submitted',
  CONTACT_SUBMITTED: 'contact_submitted',
  HELP_SEARCH: 'help_search',
  SCHEDULE_SEARCH: 'schedule_search',
  ROUTE_SELECTED: 'route_selected',
  DESTINATION_VIEW: 'destination_view',
  CHAM_MILES_REGISTER: 'cham_miles_register',
};

/**
 * App page_view vs GTM-owned page_view.
 * `app` (default): this SPA pushes one page_view per committed navigation.
 * `gtm`: the app does not push page_view; GTM/GA4 must own it.
 * send_page_view=false does not by itself disable GA4 enhanced-measurement history views.
 */
export function appOwnsPageView() {
  const source = import.meta.env?.VITE_ANALYTICS_PAGE_VIEW_SOURCE || 'app';
  return source !== 'gtm';
}

/**
 * Whether analytics events may be pushed (cookie banner accepted).
 * Set NEXT_PUBLIC_ANALYTICS_BYPASS_CONSENT=true in local dev to test without consent.
 */
export function isAnalyticsConsented() {
  if (typeof window === 'undefined') return false;
  if (process.env.NEXT_PUBLIC_ANALYTICS_BYPASS_CONSENT === 'true') return true;
  try {
    return Boolean(window.localStorage.getItem(COOKIES_BANNER_KEY));
  } catch {
    return false;
  }
}

function pathWithoutQuery(value) {
  const raw = String(value || '');
  if (!raw) return undefined;
  try {
    if (/^https?:\/\//i.test(raw)) {
      const url = new URL(raw);
      return `${url.origin}${url.pathname}`;
    }
  } catch {
    return undefined;
  }
  return raw.split('?')[0].split('#')[0] || undefined;
}

export function getRouteContext() {
  if (typeof window === 'undefined') return {};
  const pathname = window.location.pathname || '/';
  const lang = getLanguageFromPath(pathname);
  const pos = getPosFromPath(pathname);
  const pagePath = stripLanguage(pathname).split('?')[0].split('#')[0] || '/';
  const referrer = typeof document !== 'undefined' ? pathWithoutQuery(document.referrer) : undefined;
  return {
    page_path: pagePath,
    page_title: typeof document !== 'undefined' ? document.title || undefined : undefined,
    page_location: `${window.location.origin}${pathname}`,
    page_referrer: referrer,
    ...(lang ? { lang } : {}),
    ...(pos ? { pos } : {}),
  };
}

function gtagConsent() {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  return gtag;
}

/**
 * Google consent update. Does not replay earlier denied events.
 * @param {boolean} granted
 */
export function updateGoogleConsent(granted) {
  if (typeof window === 'undefined') return;
  gtagConsent()('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

/**
 * Push a booking funnel event to GTM dataLayer.
 * GTM forwards to GA4 + Clarity — do not call those SDKs directly from feature code.
 *
 * @param {string} eventName — GTM trigger / GA4 event name (snake_case)
 * @param {Record<string, string|number|boolean|null|undefined>} [params]
 */
export function pushAnalyticsEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !eventName) return false;
  if (!isAnalyticsConsented()) return false;

  const category = categoryForEvent(eventName);
  const booking = allowsBookingContext(eventName) ? getBookingAnalyticsContext() : {};
  const payload = pickEventParams(eventName, {
    ...getRouteContext(),
    ...booking,
    ...params,
    event_category: category,
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...payload,
  });
  return true;
}

export function createSubmitAttemptId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `attempt-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Maps legacy Clarity event names (still used in track* wrappers) to GTM payload.
 * Includes `clarity_event_name` so GTM can forward the original name to Clarity if needed.
 *
 * @param {string} legacyEventName
 * @returns {{ event: string, event_action: string, params?: Record<string, string> }}
 */
export function mapLegacyClarityEvent(legacyEventName) {
  const legacy = String(legacyEventName ?? '').trim();
  const mapped = LEGACY_CLARITY_EVENT_MAP[legacy];
  if (mapped) return mapped;

  return {
    event: legacy,
    event_action: legacy.replace(/^booking_/, '') || legacy,
    params: {},
  };
}

/**
 * Push a legacy Clarity-named booking event through GTM with consolidated GA4 schema.
 * Merges stored booking funnel context (search route, dates, passengers) when present.
 *
 * @param {string} legacyEventName
 * @param {Record<string, string|number|boolean|null|undefined>} [extraParams]
 */
export function pushBookingLegacyEvent(legacyEventName, extraParams = {}) {
  const { event, event_action, params = {} } = mapLegacyClarityEvent(legacyEventName);
  return pushAnalyticsEvent(event, {
    event_action,
    clarity_event_name: legacyEventName,
    ...params,
    ...extraParams,
  });
}

/** @type {Record<string, { event: string, event_action: string, params?: Record<string, string> }>} */
const LEGACY_CLARITY_EVENT_MAP = {
  search_flights_one_way_economy: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_FLIGHTS,
    event_action: 'search_flights',
    params: { trip_type: 'OneWay', cabin_class: 'Economy' },
  },
  search_flights_one_way_business: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_FLIGHTS,
    event_action: 'search_flights',
    params: { trip_type: 'OneWay', cabin_class: 'Business' },
  },
  search_flights_round_trip_economy: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_FLIGHTS,
    event_action: 'search_flights',
    params: { trip_type: 'Return', cabin_class: 'Economy' },
  },
  search_flights_round_trip_business: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_FLIGHTS,
    event_action: 'search_flights',
    params: { trip_type: 'Return', cabin_class: 'Business' },
  },
  modify_search: {
    event: ANALYTICS_EVENTS.MODIFY_SEARCH,
    event_action: 'modify_search',
  },
  booking_trip_type_one_way: {
    event: ANALYTICS_EVENTS.BOOKING_TRIP_TYPE_SELECTED,
    event_action: 'selected',
    params: { trip_type: 'OneWay' },
  },
  booking_trip_type_round_trip: {
    event: ANALYTICS_EVENTS.BOOKING_TRIP_TYPE_SELECTED,
    event_action: 'selected',
    params: { trip_type: 'Return' },
  },
  booking_trip_type_multi_city: {
    event: ANALYTICS_EVENTS.BOOKING_TRIP_TYPE_SELECTED,
    event_action: 'selected',
    params: { trip_type: 'MultiCity' },
  },
  booking_tab_book: {
    event: ANALYTICS_EVENTS.BOOKING_TAB_SELECTED,
    event_action: 'selected',
    params: { booking_box_tab: 'book' },
  },
  booking_tab_manage: {
    event: ANALYTICS_EVENTS.BOOKING_TAB_SELECTED,
    event_action: 'selected',
    params: { booking_box_tab: 'manage' },
  },
  booking_origin_airport_selected: {
    event: ANALYTICS_EVENTS.BOOKING_AIRPORT_SELECTED,
    event_action: 'selected',
    params: { airport_role: 'origin' },
  },
  booking_return_airport_selected: {
    event: ANALYTICS_EVENTS.BOOKING_AIRPORT_SELECTED,
    event_action: 'selected',
    params: { airport_role: 'destination' },
  },
  booking_cabin_class_economy: {
    event: ANALYTICS_EVENTS.BOOKING_CABIN_CLASS_SELECTED,
    event_action: 'selected',
    params: { cabin_class: 'Economy' },
  },
  booking_cabin_class_business: {
    event: ANALYTICS_EVENTS.BOOKING_CABIN_CLASS_SELECTED,
    event_action: 'selected',
    params: { cabin_class: 'Business' },
  },
  booking_departure_date_selected: {
    event: ANALYTICS_EVENTS.BOOKING_DATE_SELECTED,
    event_action: 'selected',
    params: { date_role: 'departure' },
  },
  booking_return_date_selected: {
    event: ANALYTICS_EVENTS.BOOKING_DATE_SELECTED,
    event_action: 'selected',
    params: { date_role: 'return' },
  },
  booking_passenger_adults: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_COUNT_CHANGED,
    event_action: 'changed',
    params: { passenger_type: 'adults' },
  },
  booking_passenger_children: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_COUNT_CHANGED,
    event_action: 'changed',
    params: { passenger_type: 'children' },
  },
  booking_passenger_infants: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_COUNT_CHANGED,
    event_action: 'changed',
    params: { passenger_type: 'infants' },
  },
  booking_passenger_infants_with_seat: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_COUNT_CHANGED,
    event_action: 'changed',
    params: { passenger_type: 'infants_with_seat' },
  },
  booking_search_submitted: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_SUBMITTED,
    event_action: 'submitted',
  },
  booking_flight_selection_accepted: {
    event: ANALYTICS_EVENTS.BOOKING_FLIGHT_SELECTED,
    event_action: 'selection_accepted',
  },
  booking_fare_light_selected: {
    event: ANALYTICS_EVENTS.BOOKING_FARE_SELECTED,
    event_action: 'selected',
    params: { fare_tier: 'light' },
  },
  booking_fare_smart_selected: {
    event: ANALYTICS_EVENTS.BOOKING_FARE_SELECTED,
    event_action: 'selected',
    params: { fare_tier: 'smart' },
  },
  booking_fare_premium_selected: {
    event: ANALYTICS_EVENTS.BOOKING_FARE_SELECTED,
    event_action: 'selected',
    params: { fare_tier: 'premium' },
  },
  booking_fare_elite_selected: {
    event: ANALYTICS_EVENTS.BOOKING_FARE_SELECTED,
    event_action: 'selected',
    params: { fare_tier: 'elite' },
  },
  booking_fare_business_selected: {
    event: ANALYTICS_EVENTS.BOOKING_FARE_SELECTED,
    event_action: 'selected',
    params: { fare_tier: 'business' },
  },
  booking_nearby_airports_enabled: {
    event: ANALYTICS_EVENTS.BOOKING_NEARBY_AIRPORTS_ENABLED,
    event_action: 'enabled',
  },
  booking_selected_flight_success: {
    event: ANALYTICS_EVENTS.BOOKING_FLIGHT_SELECTED,
    event_action: 'api_success',
  },
  booking_proceed_passenger_details: {
    event: ANALYTICS_EVENTS.BOOKING_FUNNEL_STEP,
    event_action: 'proceed_passenger_details',
    params: { step_name: 'proceed_passenger_details', booking_step: '1' },
  },
  booking_passenger_info_success: {
    event: ANALYTICS_EVENTS.BOOKING_FUNNEL_STEP,
    event_action: 'passenger_info_success',
    params: { step_name: 'passenger_info_success', booking_step: '2' },
  },
  booking_payment_submit: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_SUBMIT,
    event_action: 'submit',
    params: { booking_step: '3' },
  },
  booking_confirm_viewed: {
    event: ANALYTICS_EVENTS.BOOKING_CONFIRM_VIEW,
    event_action: 'viewed',
  },
  booking_passenger_info_started: {
    event: ANALYTICS_EVENTS.BOOKING_FUNNEL_STEP,
    event_action: 'passenger_info_started',
    params: { step_name: 'passenger_info_started', booking_step: '1' },
  },
  booking_passenger_info_title: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'title' },
  },
  booking_passenger_info_first_name: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'first_name' },
  },
  booking_passenger_info_last_name: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'last_name' },
  },
  booking_passenger_info_date_of_birth: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'date_of_birth' },
  },
  booking_passenger_info_nationality: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'nationality' },
  },
  booking_passenger_info_contact_adult: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'contact_adult' },
  },
  booking_passenger_info_contact_country_code: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'contact_country_code' },
  },
  booking_passenger_info_contact_phone: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'contact_phone' },
  },
  booking_passenger_info_contact_email: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'contact_email' },
  },
  booking_passenger_info_contact_alt_phone: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_FIELD_EDITED,
    event_action: 'edited',
    params: { field_name: 'contact_alt_phone' },
  },
  booking_seat_map_loaded: {
    event: ANALYTICS_EVENTS.BOOKING_ANCILLARY_LOADED,
    event_action: 'loaded',
    params: { ancillary_type: 'seat' },
  },
  booking_baggage_options_loaded: {
    event: ANALYTICS_EVENTS.BOOKING_ANCILLARY_LOADED,
    event_action: 'loaded',
    params: { ancillary_type: 'baggage' },
  },
  booking_seat_clicked: {
    event: ANALYTICS_EVENTS.BOOKING_SEAT_INTERACTION,
    event_action: 'clicked',
    params: { ancillary_type: 'seat' },
  },
  booking_seat_selection_confirmed: {
    event: ANALYTICS_EVENTS.BOOKING_SEAT_INTERACTION,
    event_action: 'confirmed',
    params: { ancillary_type: 'seat' },
  },
  booking_seat_selection_skipped: {
    event: ANALYTICS_EVENTS.BOOKING_SEAT_INTERACTION,
    event_action: 'skipped',
    params: { ancillary_type: 'seat' },
  },
  booking_baggage_option_selected: {
    event: ANALYTICS_EVENTS.BOOKING_BAGGAGE_INTERACTION,
    event_action: 'selected',
    params: { ancillary_type: 'baggage' },
  },
  booking_baggage_confirm_submitted: {
    event: ANALYTICS_EVENTS.BOOKING_BAGGAGE_INTERACTION,
    event_action: 'confirm_submitted',
    params: { ancillary_type: 'baggage' },
  },
  booking_seat_removed: {
    event: ANALYTICS_EVENTS.BOOKING_SEAT_INTERACTION,
    event_action: 'removed',
    params: { ancillary_type: 'seat' },
  },
  booking_baggage_removed: {
    event: ANALYTICS_EVENTS.BOOKING_BAGGAGE_INTERACTION,
    event_action: 'removed',
    params: { ancillary_type: 'baggage' },
  },
  booking_ancillary_page_rendered: {
    event: ANALYTICS_EVENTS.BOOKING_ANCILLARY_PAGE_VIEW,
    event_action: 'rendered',
    params: { booking_step: '2' },
  },
  booking_wheelchair_opened: {
    event: ANALYTICS_EVENTS.BOOKING_WHEELCHAIR_INTERACTION,
    event_action: 'opened',
    params: { ancillary_type: 'wheelchair' },
  },
  booking_wheelchair_passenger_added: {
    event: ANALYTICS_EVENTS.BOOKING_WHEELCHAIR_INTERACTION,
    event_action: 'added',
    params: { ancillary_type: 'wheelchair' },
  },
  booking_wheelchair_passenger_removed: {
    event: ANALYTICS_EVENTS.BOOKING_WHEELCHAIR_INTERACTION,
    event_action: 'removed',
    params: { ancillary_type: 'wheelchair' },
  },
  booking_lounge_opened: {
    event: ANALYTICS_EVENTS.BOOKING_LOUNGE_INTERACTION,
    event_action: 'opened',
    params: { ancillary_type: 'lounge' },
  },
  booking_lounge_passenger_added: {
    event: ANALYTICS_EVENTS.BOOKING_LOUNGE_INTERACTION,
    event_action: 'added',
    params: { ancillary_type: 'lounge' },
  },
  booking_lounge_passenger_removed: {
    event: ANALYTICS_EVENTS.BOOKING_LOUNGE_INTERACTION,
    event_action: 'removed',
    params: { ancillary_type: 'lounge' },
  },
  booking_search_api_success: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_API_SUCCESS,
    event_action: 'success',
    params: { booking_step: '0' },
  },
  booking_search_api_failed: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_API_FAILED,
    event_action: 'failed',
    params: { booking_step: '0' },
  },
  booking_search_api_empty: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_API_EMPTY,
    event_action: 'empty',
    params: { booking_step: '0' },
  },
  booking_search_results_view: {
    event: ANALYTICS_EVENTS.BOOKING_SEARCH_RESULTS_VIEW,
    event_action: 'rendered',
    params: { booking_step: '0' },
  },
  booking_passenger_info_failed: {
    event: ANALYTICS_EVENTS.BOOKING_PASSENGER_INFO_FAILED,
    event_action: 'failed',
    params: { booking_step: '1' },
  },
  booking_payment_step_view: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_STEP_VIEW,
    event_action: 'rendered',
    params: { booking_step: '3' },
  },
  booking_payment_method_selected: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_METHOD_SELECTED,
    event_action: 'selected',
    params: { booking_step: '3' },
  },
  booking_payment_terms_accepted: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_TERMS_ACCEPTED,
    event_action: 'accepted',
    params: { booking_step: '3' },
  },
  booking_payment_external_redirect: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_EXTERNAL_REDIRECT,
    event_action: 'redirect',
    params: { booking_step: '3' },
  },
  booking_payment_return_callback: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_RETURN_CALLBACK,
    event_action: 'returned',
    params: { booking_step: '3' },
  },
  booking_payment_gateway_success: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_GATEWAY_SUCCESS,
    event_action: 'confirmed',
    params: { booking_step: '3' },
  },
  booking_payment_gateway_failed: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_GATEWAY_FAILED,
    event_action: 'failed',
    params: { booking_step: '3' },
  },
  booking_payment_cancelled: {
    event: ANALYTICS_EVENTS.BOOKING_PAYMENT_CANCELLED,
    event_action: 'cancelled',
    params: { booking_step: '3' },
  },
  booking_post_payment_creation_failed: {
    event: ANALYTICS_EVENTS.BOOKING_POST_PAYMENT_CREATION_FAILED,
    event_action: 'failed',
    params: { booking_step: '3' },
  },
  booking_session_expired: {
    event: ANALYTICS_EVENTS.BOOKING_SESSION_EXPIRED,
    event_action: 'detected',
  },
  booking_view_ticket_opened: {
    event: ANALYTICS_EVENTS.BOOKING_VIEW_TICKET_OPENED,
    event_action: 'opened',
    params: { booking_step: '4' },
  },
  booking_ticket_download: {
    event: ANALYTICS_EVENTS.BOOKING_TICKET_DOWNLOAD,
    event_action: 'download',
  },
  booking_ticket_language_changed: {
    event: ANALYTICS_EVENTS.BOOKING_TICKET_LANGUAGE_CHANGED,
    event_action: 'changed',
  },
};
