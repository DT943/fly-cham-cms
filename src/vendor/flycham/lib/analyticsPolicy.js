/**
 * Event categories, booking-context policy, and payload allowlists.
 * Feature code must not push to dataLayer itself.
 */

/** Keys that must never reach dataLayer, including via merged booking context. */
export const DENIED_PARAM_KEYS = new Set([
  'email',
  'contact_email',
  'phone',
  'contact_phone',
  'contact_alt_phone',
  'telephone',
  'card_number',
  'payment_card',
  'cvv',
  'cvc',
  'password',
  'passport',
  'passport_number',
  'national_id',
  'first_name',
  'last_name',
  'full_name',
  'name',
  'date_of_birth',
  'dob',
  'birth_date',
  'message',
  'query',
  'q',
  'error',
  'error_body',
  'error_message',
  'token',
  'search',
  'pnr',
  'booking_reference',
  'payment_session_id',
  'payment_intent',
  'client_secret',
  'session_id',
  'address',
  'promo_code',
])

const SEARCH_FIELDS = [
  'trip_type',
  'cabin_class',
  'origin_iata',
  'destination_iata',
  'departure_date',
  'return_date',
  'passengers_adult',
  'passengers_child',
  'passengers_infant',
  'passengers_infant_with_seat',
  'nearby_airports',
  'search_attempt_id',
  'modify_search',
]

const ROUTE_FIELDS = ['page_path', 'page_title', 'lang', 'pos', 'page_location', 'page_referrer']

const BOOKING_COMMON = [
  ...ROUTE_FIELDS,
  ...SEARCH_FIELDS,
  'event_action',
  'event_category',
  'clarity_event_name',
  'booking_step',
  'step_name',
  'selection_type',
  'airport_role',
  'date_role',
  'passenger_type',
  'passenger_count',
  'booking_box_tab',
  'fare_tier',
  'fare_name',
  'selected_cabin',
]

function allow(...keys) {
  return new Set(keys)
}

/** Events that may include the stored booking funnel context. */
export const BOOKING_CONTEXT_EVENTS = new Set([
  'flight_search',
  'outbound_search',
  'booking_search_submitted',
  'booking_search_flights',
  'modify_search',
  'booking_trip_type_selected',
  'booking_tab_selected',
  'booking_airport_selected',
  'booking_cabin_class_selected',
  'booking_date_selected',
  'booking_passenger_count_changed',
  'booking_flight_selected',
  'booking_fare_selected',
  'booking_nearby_airports_enabled',
  'booking_funnel_step',
  'booking_passenger_field_edited',
  'booking_ancillary_loaded',
  'booking_seat_interaction',
  'booking_baggage_interaction',
  'booking_ancillary_page_view',
  'booking_wheelchair_interaction',
  'booking_lounge_interaction',
  'booking_payment_submit',
  'booking_confirm_view',
  'booking_search_api_success',
  'booking_search_api_failed',
  'booking_search_api_empty',
  'booking_search_results_view',
  'booking_passenger_info_failed',
  'booking_payment_step_view',
  'booking_payment_method_selected',
  'booking_payment_terms_accepted',
  'booking_payment_external_redirect',
  'booking_payment_return_callback',
  'booking_payment_gateway_success',
  'booking_payment_gateway_failed',
  'booking_payment_cancelled',
  'booking_post_payment_creation_failed',
  'booking_session_expired',
  'booking_view_ticket_opened',
  'booking_ticket_download',
  'booking_ticket_language_changed',
])

export const EVENT_CATEGORY = {
  page_view: 'navigation',
  language_changed: 'navigation',
  destination_view: 'navigation',
  cookie_consent: 'consent',
  outbound_search: 'booking',
  flight_search: 'booking',
  deal_selected: 'engagement',
  newsletter_submitted: 'marketing',
  contact_submitted: 'support',
  help_search: 'engagement',
  schedule_search: 'engagement',
  route_selected: 'engagement',
  cham_miles_register: 'account',
}

const ENGAGEMENT = allow(
  'event_action',
  'event_category',
  ...ROUTE_FIELDS,
  'deal_id',
  'origin_iata',
  'destination_iata',
  'fare_label',
  'query_length',
  'has_results',
  'travel_date',
  'destination_slug',
  'from_lang',
  'to_lang',
)

export const EVENT_ALLOWLIST = {
  page_view: allow('event_action', 'event_category', ...ROUTE_FIELDS),
  cookie_consent: allow('event_action', 'event_category', 'page_path', 'lang', 'pos'),
  language_changed: allow('event_action', 'event_category', 'from_lang', 'to_lang', 'page_path', 'lang', 'pos'),
  outbound_search: allow(
    'event_action',
    'event_category',
    'destination_host',
    'results_path',
    ...SEARCH_FIELDS,
    'page_path',
    'lang',
    'pos',
  ),
  deal_selected: ENGAGEMENT,
  newsletter_submitted: allow(
    'event_action',
    'event_category',
    'form_location',
    'form_id',
    'submit_attempt_id',
    'result',
    'page_path',
    'lang',
    'pos',
  ),
  contact_submitted: allow(
    'event_action',
    'event_category',
    'form_id',
    'form_location',
    'topic_category',
    'submit_attempt_id',
    'result',
    'page_path',
    'lang',
    'pos',
  ),
  help_search: ENGAGEMENT,
  schedule_search: ENGAGEMENT,
  route_selected: ENGAGEMENT,
  destination_view: ENGAGEMENT,
  cham_miles_register: allow(
    'event_action',
    'event_category',
    'submit_attempt_id',
    'result',
    'form_location',
    'page_path',
    'lang',
    'pos',
  ),
  flight_search: allow('event_action', 'event_category', ...BOOKING_COMMON),
  booking_flight_selected: allow(
    ...BOOKING_COMMON,
    'flight_count',
  ),
  booking_search_api_success: allow(
    ...BOOKING_COMMON,
    'direct_flight_count',
    'indirect_flight_count',
    'flight_count',
    'request_id',
  ),
  booking_search_api_failed: allow(
    ...BOOKING_COMMON,
    'status_code',
    'error_kind',
    'request_id',
  ),
  booking_search_api_empty: allow(...BOOKING_COMMON, 'request_id'),
  booking_search_results_view: allow(...BOOKING_COMMON, 'has_flights'),
  booking_fare_selected: allow(...BOOKING_COMMON),
  booking_passenger_field_edited: allow(
    ...BOOKING_COMMON,
    'field_name',
    'passenger_index',
    'passenger_form_section',
  ),
  booking_passenger_info_failed: allow(
    ...BOOKING_COMMON,
    'error_kind',
    'status_code',
    'error_source',
    'validation_field_count',
  ),
  booking_ancillary_loaded: allow(...BOOKING_COMMON, 'ancillary_type', 'segment_count'),
  booking_ancillary_page_view: allow(
    ...BOOKING_COMMON,
    'has_seat',
    'has_baggage',
    'has_wheelchair',
    'has_lounge',
  ),
  booking_seat_interaction: allow(
    ...BOOKING_COMMON,
    'ancillary_type',
    'seat_number',
    'leg_index',
    'passenger_index',
    'guest_id',
    'remove_source',
  ),
  booking_baggage_interaction: allow(
    ...BOOKING_COMMON,
    'ancillary_type',
    'baggage_option_id',
    'leg_index',
    'baggage_passenger_id',
    'guest_id',
    'remove_source',
  ),
  booking_wheelchair_interaction: allow(
    ...BOOKING_COMMON,
    'ancillary_type',
    'segment_id',
    'guest_id',
  ),
  booking_lounge_interaction: allow(
    ...BOOKING_COMMON,
    'ancillary_type',
    'segment_id',
    'guest_id',
  ),
  booking_funnel_step: allow(...BOOKING_COMMON),
  booking_payment_submit: allow(...BOOKING_COMMON, 'payment_method', 'payment_attempt_id'),
  booking_payment_step_view: allow(
    ...BOOKING_COMMON,
    'payment_options_count',
    'has_payment_options_error',
  ),
  booking_payment_method_selected: allow(
    ...BOOKING_COMMON,
    'payment_method',
    'payment_option_code',
    'stripe_method',
  ),
  booking_payment_terms_accepted: allow(...BOOKING_COMMON),
  booking_payment_external_redirect: allow(
    ...BOOKING_COMMON,
    'payment_method',
    'redirect_mode',
    'stripe_method',
    'redirect_host',
    'payment_attempt_id',
  ),
  booking_payment_return_callback: allow(
    ...BOOKING_COMMON,
    'redirect_status',
    'payment_method',
    'has_stripe_redirect_params',
    'payment_attempt_id',
  ),
  booking_payment_gateway_success: allow(...BOOKING_COMMON, 'payment_attempt_id'),
  booking_payment_gateway_failed: allow(
    ...BOOKING_COMMON,
    'error_kind',
    'redirect_status',
    'payment_attempt_id',
  ),
  booking_payment_cancelled: allow(
    ...BOOKING_COMMON,
    'cancel_source',
    'redirect_status',
    'payment_method',
    'payment_attempt_id',
  ),
  booking_post_payment_creation_failed: allow(
    ...BOOKING_COMMON,
    'failure_kind',
    'payment_attempt_id',
  ),
  booking_session_expired: allow(...BOOKING_COMMON, 'expiry_source'),
  booking_confirm_view: allow(...BOOKING_COMMON),
  booking_view_ticket_opened: allow(...BOOKING_COMMON, 'ticket_source'),
  booking_ticket_download: allow(
    ...BOOKING_COMMON,
    'with_price',
    'download_attempt_id',
  ),
  booking_ticket_language_changed: allow(...BOOKING_COMMON, 'from_lang', 'to_lang'),
}

const DEFAULT_BOOKING_ALLOW = allow(...BOOKING_COMMON)

export function categoryForEvent(eventName) {
  if (EVENT_CATEGORY[eventName]) return EVENT_CATEGORY[eventName]
  if (BOOKING_CONTEXT_EVENTS.has(eventName)) return 'booking'
  return 'engagement'
}

export function allowsBookingContext(eventName) {
  return BOOKING_CONTEXT_EVENTS.has(eventName)
}

export function isDeniedParamKey(key) {
  return DENIED_PARAM_KEYS.has(String(key || '').toLowerCase())
}

/**
 * Keep allowlisted, non-empty, non-PII values.
 * @param {string} eventName
 * @param {Record<string, unknown>} params
 */
export function pickEventParams(eventName, params = {}) {
  const allowlist = EVENT_ALLOWLIST[eventName] || DEFAULT_BOOKING_ALLOW
  const out = {}
  for (const [key, value] of Object.entries(params)) {
    if (!allowlist.has(key) || isDeniedParamKey(key)) continue
    if (value == null || value === '') continue
    if (typeof value === 'boolean') {
      out[key] = value
      continue
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = value
      continue
    }
    const str = String(value).trim()
    if (!str) continue
    if (str.includes('@')) continue
    out[key] = str
  }
  return out
}
