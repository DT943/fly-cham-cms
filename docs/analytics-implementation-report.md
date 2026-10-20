# Fly Cham analytics implementation report

This report covers the CMS repository only. Local `dataLayer` behavior was tested here. Delivery to GTM, GA4, or Clarity was not observed. Nothing was published to a GTM container.

## What changed

Search, page view, consent, language, deals, newsletters, help search, schedules, route selection, destination views, and Cham Miles registration now go through `pushAnalyticsEvent` in `src/vendor/flycham/lib/analytics.js`. Feature code does not call `gtag` or Clarity directly. Google consent uses the dataLayer consent command: default denied in `index.html` before GTM, then `consent update` when acceptance is already stored or the visitor accepts.

Booking context is merged only into booking events. Newsletter, help, page, consent, and similar events use their own category and allowlist. Denied keys (email, phone, names, date of birth, passwords, passport or card data, free text, raw queries, raw errors, URL tokens, PNRs, booking references, payment session ids) are removed from the push, including values that arrived via stored context.

`lang` and `pos` come from the CMS `/<pos>/<lang>/...` parser. A URL that does not have them omits those fields.

## Overlap decisions

| Names | Decision |
| --- | --- |
| `booking_search_submitted`, `flight_search`, `outbound_search` | Three stages of one attempt, one `search_attempt_id`. Count validated searches with `flight_search` only. Do not add the three names together. |
| `booking_search_flights` | Compatibility event for one-way and return economy or business. Multi-city stays excluded. |
| `modify_search` | Diagnostic flag that a submitted attempt was a modify. Not an extra completed search. |
| `booking_flight_selected` | One event after the authoritative selection, `event_action=api_success`. The wrapper no longer also pushes `selection_accepted`. |
| `booking_fare_selected` | Separate committed fare choice. Flight selection does not emit it. |
| `booking_search_api_success` / `_empty` / `_failed` | One final outcome per `request_id`. Success plus empty is not emitted. An intermediate retry must not call failed. |
| `booking_search_results_view` | Visible-results milestone, not another API success. |
| `page_view` | App router is the chosen source when `VITE_ANALYTICS_PAGE_VIEW_SOURCE` is `app` (default). Set it to `gtm` to stop the app push. |
| `destination_view`, booking step views | Specialized events. They are not mapped to `page_view`. |
| Payment names | Submission, redirect, return callback, gateway success, gateway failure, cancellation, and post-payment booking-creation failure stay separate. A callback or confirmation render is not payment. Transient audit or network kinds (`timeout`, `network`, `polling`, `audit_transport`, `transient`) do not emit gateway failure. |
| Grouped booking events | Keep `event_action` plus step, product, or phase. `booking_ticket_download` `started` is not `success`. |
| `language_changed` vs `booking_ticket_language_changed` | Site language and e-ticket language stay separate. |

## Canonical reporting rules

| Metric | Filter |
| --- | --- |
| Validated searches | `flight_search`. Do not sum search event names. |
| Accepted click, including invalid downstream | `booking_search_submitted` |
| External handoff | `outbound_search` |
| Compatibility search shape | `booking_search_flights` (excludes multi-city) |
| Modify diagnostic | `modify_search` |
| Bookable availability | `booking_search_api_success` |
| Empty availability | `booking_search_api_empty` |
| Final availability failure | `booking_search_api_failed` |
| Results seen | `booking_search_results_view` |
| Committed flight | `booking_flight_selected` and `event_action=api_success` |
| Legacy selection action | `event_action=selection_accepted` is no longer emitted by the wrapper. Historical rows may still exist. |
| Committed fare | `booking_fare_selected` |
| Confirmed payment | `booking_payment_gateway_success` |
| Explicit cancel | `booking_payment_cancelled` |
| Authoritative payment failure | `booking_payment_gateway_failed` |
| Paid, booking not created | `booking_post_payment_creation_failed` |
| Confirmation screen | `booking_confirm_view` |
| Download started / finished | `booking_ticket_download` with `event_action` `started` or `success` |
| Newsletter or registration success | `event_action=result` and `result=success`. `attempt` is not a success. |
| Page views | One `page_view` per navigation key. Do not also count a GTM History Change or GA4 history enhanced-measurement hit for the same navigation. |

## GTM / GA4 configuration (not verified in a container)

`index.html` loads `GTM-NCVSFFNB` and now sets consent default to denied with `wait_for_update: 500`. Acceptance calls `gtag('consent','update', { analytics_storage: 'granted' })`. Ad storage stays denied.

`send_page_view: false` on the GA4 Config tag does not disable enhanced measurement "page changes based on browser history events". To avoid a second GA4 page_view while the app owns page_view:

1. GA4 tag: `send_page_view` false.
2. GA4 enhanced measurement: turn off browser-history page views.
3. GTM: remove or pause a History Change trigger that fires a GA4 page_view.
4. Do not add a second GA4 Event tag on the dataLayer event `page_view` unless the config tag is not sending page views.

Set `VITE_ANALYTICS_PAGE_VIEW_SOURCE=gtm` if GTM should remain the only page_view source. Downstream deduplication is unverified until that container is inspected. References: [GA4 pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views), [single-page applications](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [consent](https://developers.google.com/tag-platform/security/guides/consent).

## CMS event matrix

| Event | Owner | Trigger | Payload | Count | Status |
| --- | --- | --- | --- | --- | --- |
| `page_view` | `Layout.jsx` `trackPageView` | Initial consented view, router navigation, back/forward, language navigation. Not on render. | `page_path`, `page_title`, `lang`, `pos`, `page_location`, `page_referrer` without query | Once per navigation key. Consent denial does not consume it. Re-accept does not add a second view if one already fired. | Implemented in dataLayer. GTM/GA4 dedupe unverified. |
| `cookie_consent` | `CookieConsent.jsx` | Accept after the cookie and localStorage are written. Dismiss while already granted. | `event_action` `accepted` or `dismissed` | One per choice. Close while denied is local only. | Implemented. Not a network-delivery guarantee. |
| `language_changed` | `Layout.jsx` | Path language changes after the first committed language. | `from_lang`, `to_lang` | One transition. Same language and first load ignored. | Implemented. |
| `outbound_search` | `useBookingFormik.jsx` via `emitValidatedSearchNavigation` | Immediately before external `router.push`. | `destination_host`, query-free `results_path`, `search_attempt_id`, search context | Once per attempt. Does not block navigation. | Implemented for the CMS handoff to flycham.com. |
| `flight_search` | same owner | Validated search about to navigate, including in-page modify. | `event_action=search`, `search_attempt_id`, search context | Once per attempt. This is the validated-search metric. | Implemented. |
| `booking_search_submitted` | `SearchFlightsButton.jsx` and `ModalFooter.jsx` through `trackSearchFlightsClarityEvent` | Enabled click. Second click while locked is ignored. | search context, `search_attempt_id` | Once per attempt. Lock releases if navigation does not start. | Implemented. One owner per click. |
| `booking_search_flights` | same | One-way or return, economy or business only. | legacy trip and cabin mapping | Once per attempt. Multi-city excluded. | Implemented as compatibility. |
| `modify_search` | same | `modifySearch` true | `modify_search` | Diagnostic only. | Implemented. |
| `deal_selected` | `DealCard.jsx` book link | Click on the deal action. | `deal_id`, IATA codes when they are 3 letters, `fare_label` | One per click. | Implemented. CMS deals often have no IATA; those fields are omitted. |
| `newsletter_submitted` | `NewsletterSignup`, shared `MediaNewsletterSignup`, media-center variant, `NewsletterForm` | Real submit handlers. | `form_location`, `form_id`, `submit_attempt_id`, `event_action=attempt` | One attempt per submit. | Attempt only. No backend. Timer success is not `result=success`. Outcome blocked. |
| `contact_submitted` | none | `ContactForms.jsx` only links to a form. `FormDetail.jsx` renders a title and does not submit. | `form_id`, `topic_category`, `submit_attempt_id` would be allowed | — | Blocked. No submit handler. Not invented. |
| `help_search` | `SearchConsole.jsx` when the path is under `/help` | Enter or the submit control, not suggestion render and not the header site search. | `query_length`, `has_results` | One per explicit commit. | Implemented. Raw query is not sent. |
| `schedule_search` | `FlightScheduleSearch.jsx` | Valid schedule submit. | `origin_iata`, `destination_iata`, `travel_date` | One per successful validation. | Implemented. Separate from booking availability. |
| `route_selected` | `RouteMapExplorer.jsx` | Both ends set by the traveller. Reset clears the pair so a later choice counts. | `origin_iata`, `destination_iata` | Not on empty defaults. Not on booking-box prefill. | Implemented. |
| `destination_view` | `DynamicPage.jsx` after the CMS page is loaded | `/our-destinations/flights-to-*` and `things-to-do-in-*` | `destination_slug`, `destination_iata` when the destination list has one | Once per navigation key and slug. A new visit can count again. | Implemented for mounted CMS pages. Card lists do not emit it. |
| `cham_miles_register` | `ChamMilesJoinView.jsx` for the early-bird API; `ChamMilesRegister.jsx` and `ChamMilesRegisterForm.jsx` for the preventDefault register forms | Register submit only. Login is not instrumented. | `submit_attempt_id`, `event_action`, `result` when known | Attempt and, for the join API, `result=success\|error`. Validation failure on the join form records `validation_error`. | Join API outcome implemented. The other two forms are attempt only; outcome blocked (no backend). |

## Booking events that already fire from the CMS booking box

These were already wired and still flow through the same dispatch path: trip type, tab, airport, cabin, date, passenger count, nearby airports. Their category remains `booking`.

## Booking-engine events (not implemented in this repository)

The CMS does not mount results, passengers, extras, payment, confirmation, or ticket screens. `D:\FlychamFrontEnd\flychamwebsite` contains that flow (`search-results-v5`, `booking-confirm-v5`, `e-ticket`) but it is not part of this workspace, so it was not edited. Helpers in this repo's `clarity.js` now match the overlap rules (single flight-selection push, one availability outcome per `request_id`, payment terminal claim, no PNR or payment session id, passenger-field dedupe reset per search). Calling them from the engine is still required.

| Event | Owning screen to wire | Required trigger | Status |
| --- | --- | --- | --- |
| `booking_search_api_success` | `search-results-v5/hooks/useFlightResultsData.js` | Settled availability with bookable flights. Pass `requestId`. | Blocked, source outside this repo |
| `booking_search_api_empty` | same | Settled success, zero bookable flights. Same `requestId`, not also success. | Blocked |
| `booking_search_api_failed` | same | Final failure only, after retries are exhausted. | Blocked |
| `booking_search_results_view` | results step when the list is visible | Once per settled view, not per API retry. | Blocked |
| `booking_flight_selected` | `useSelectFlightHook.jsx` after the selection API succeeds | `trackFlightSelectionAcceptedClarityEvent` now emits only `event_action=api_success`. Do not also emit a fare. | Blocked |
| `booking_fare_selected` | fare tier control on the flight card | Committed fare choice only. | Blocked |
| `booking_funnel_step` | passenger proceed, passenger info success | Each supported step action, not a single representative. | Blocked |
| `booking_passenger_field_edited` | passenger and contact sections | Committed field change, no value. Reset session on a new booking. | Blocked |
| `booking_passenger_info_failed` | `PassengersContext.jsx` | API or server validation failure. No raw body. | Blocked |
| `booking_ancillary_page_view` | `SeatsExtrasCards.jsx` | Extras step visible. | Blocked |
| `booking_ancillary_loaded` | seat map and baggage option loads | Resource completed, with `ancillary_type`. | Blocked |
| `booking_seat_interaction` | seat click, confirm, skip, remove | Each action via `event_action`. | Blocked |
| `booking_baggage_interaction` | select, confirm submit, remove | Each action. | Blocked |
| `booking_wheelchair_interaction` | open, add, remove | Each action. | Blocked |
| `booking_lounge_interaction` | open, add, remove | Each action. | Blocked |
| `booking_payment_step_view` | `Payment.jsx` | Options request settled and step visible. | Blocked |
| `booking_payment_method_selected` | payment context | Method choice. | Blocked |
| `booking_payment_terms_accepted` | both required checkboxes accepted | Once per acceptance. | Blocked |
| `booking_payment_submit` | submit handler | Submission attempt, `event_action=request_started`. | Blocked |
| `booking_payment_external_redirect` | `paymentFlowAnalytics.js` | Immediately before leaving the site. | Blocked |
| `booking_payment_return_callback` | confirm return URL | Landed callback. Not proof of payment. | Blocked |
| `booking_payment_gateway_success` | booking audit success | Authoritative success. Dedupe on `paymentAttemptId`. No PNR or session id. | Blocked |
| `booking_payment_gateway_failed` | authoritative failure branch | Not a generic catch and not a transient audit error. | Blocked |
| `booking_payment_cancelled` | explicit cancel | Distinct from failure. | Blocked |
| `booking_post_payment_creation_failed` | payment taken, booking create failed | Not the same event as gateway failure. | Blocked |
| `booking_confirm_view` | confirmation screen visible | View only. | Blocked |
| `booking_session_expired` | session guard or confirm audit | Detected expiry. | Blocked |
| `booking_view_ticket_opened` | View Ticket action | Opened. No PNR. | Blocked |
| `booking_ticket_download` | `e-ticket/useTicketPdfExport.js` | `phase=started` then `phase=success` with `downloadAttemptId`. | Blocked |
| `booking_ticket_language_changed` | `EticketLanguageSwitcher.jsx` | Ticket language only. | Blocked |

## Tests and build

`npm test` runs `scripts/analytics-behavior-check.mjs` (Node test runner plus an `@/` alias loader). All 12 cases passed:

- consent denial does not push and does not consume the later page view
- one page view per navigation key, a second for a new key, referrer without query
- one submitted, one `flight_search`, one `outbound_search`, shared attempt id, IATA `DAM`/`DXB`, no token on `results_path`
- retry after unlock; one-way drops the previous return date
- multi-city does not emit `booking_search_flights`
- one `booking_flight_selected` with `api_success`, no fare event, no PNR
- one availability outcome per request id
- timeout is not a payment failure; repeated success is one event; no session id
- download started and success; newsletter has no email and no booking origin
- help search keeps length only
- one passenger field edit per passenger and field
- context replace clears a stale return date

`npx vite build` completed (Vite 8.2.2, exit 0). There is no lint script in `package.json`.

Example consented search push (shape, ids vary):

```json
{
  "event": "outbound_search",
  "event_category": "booking",
  "event_action": "handoff",
  "destination_host": "flycham.com",
  "results_path": "/gb/en/search-results",
  "search_attempt_id": "<uuid>",
  "origin_iata": "DAM",
  "destination_iata": "DXB",
  "trip_type": "Return",
  "lang": "en",
  "pos": "sy",
  "page_path": "/help"
}
```

Example newsletter push:

```json
{
  "event": "newsletter_submitted",
  "event_category": "marketing",
  "event_action": "attempt",
  "form_location": "newsletter_signup",
  "form_id": "newsletter-signup",
  "submit_attempt_id": "<uuid>"
}
```

## Blockers

- Booking-engine screens are not in this repository. The 30 funnel events above are helper-ready here and marked blocked, not counted as production wiring.
- Newsletter forms and the non-join Cham Miles forms have no backend. Only `event_action=attempt` is emitted. Join registration can emit `result` from `postProfileData('/member/early-bird')`.
- `contact_submitted` has no form submit on `FormDetail.jsx`.
- GTM/GA4/Clarity delivery and history-pageview deduplication were not observed.
