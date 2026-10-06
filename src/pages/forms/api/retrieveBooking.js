/**
 * PNR lookup against the two reservation systems flycham.com runs, ported from
 * flychamwebsite's manage-booking tabs:
 *
 *  - AccelAero → `searchBookService` (store/Services/manageBookingServices.js):
 *    POST /api/managebooking/InquirePNR/GetMainInfo?language=  { PNR, lastName }
 *    Always answers 200; a miss comes back as `result.alert`.
 *  - iFly Res  → `fetchRetrievePnr` (lib/manageBookingB2c/retrievePnrClient.js):
 *    POST /api/b2c_managebooking/RetrieveBooking  { pnrNumber, lastName }
 *    A miss is a non-2xx with `error.message`; the session id comes back in the
 *    `X-Session-Id` header (exposed via CORS) or the body.
 *
 * Both endpoints allow any origin, so the browser calls flycham.com directly.
 */

export const FLYCHAM_API_BASE_URL = (
  import.meta.env.VITE_FLYCHAM_API_BASE_URL || 'https://flycham.com/api'
).replace(/\/+$/, '')

export const BOOKING_SYSTEMS = {
  accelAero: 'accelAero',
  iFly: 'iFly',
}

const TIMEOUT_MS = 60000

function parseJsonSafe(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

/** First user-facing message in an API error envelope (flychamwebsite `extractB2cErrorMessage`). */
function extractErrorMessage(payload) {
  const candidates = [payload?.error?.message, payload?.message, payload?.detail, payload?.title]
  if (typeof payload?.error === 'string') candidates.push(payload.error)
  const message = candidates.find((value) => typeof value === 'string' && value.trim())
  return message ? message.trim() : null
}

async function postJson(path, body, { headers = {} } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${FLYCHAM_API_BASE_URL}/${path}`, {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: controller.signal,
    })
    const data = parseJsonSafe(await res.text())
    return { res, data }
  } finally {
    clearTimeout(timer)
  }
}

async function retrieveAccelAero({ pnr, lastName, language }) {
  const lang = language === 'ar' ? 'ar' : 'en'
  const { res, data } = await postJson(`managebooking/InquirePNR/GetMainInfo?language=${lang}`, {
    lastName,
    PNR: pnr,
  })
  const result = data?.result

  if (res.ok && data?.statusCode === 200 && result && !result.alert) {
    return { ok: true, data: result }
  }
  return {
    ok: false,
    alert: {
      title: result?.alert?.title || null,
      description: result?.alert?.description || extractErrorMessage(data),
    },
  }
}

async function retrieveIFly({ pnr, lastName }) {
  const { res, data } = await postJson('b2c_managebooking/RetrieveBooking', {
    pnrNumber: pnr,
    ...(lastName ? { lastName } : {}),
  })

  if (!res.ok) {
    return { ok: false, alert: { title: null, description: extractErrorMessage(data) } }
  }

  const sessionId =
    res.headers.get('x-session-id') || data?.sessionId || data?.result?.sessionId || null
  return {
    ok: true,
    data,
    session: {
      sessionId,
      identityId:
        res.headers.get('x-identity-id') || data?.identityId || data?.result?.identityId || null,
      expiresAtUtc:
        res.headers.get('x-session-expiry-utc') ||
        data?.expiresAtUtc ||
        data?.result?.expiresAtUtc ||
        null,
    },
  }
}

const RETRIEVERS = {
  [BOOKING_SYSTEMS.accelAero]: retrieveAccelAero,
  [BOOKING_SYSTEMS.iFly]: retrieveIFly,
}

/**
 * Look a booking up in the chosen system. Never throws: resolves to
 * `{ ok: true, data, session? }` or `{ ok: false, alert: { title, description } }`
 * (alert fields may be null — the caller supplies localized fallbacks).
 */
export async function retrieveBooking(system, { pnr, lastName, language }) {
  // Unknown / missing CMS value → AccelAero, the admin's default.
  const retrieve = RETRIEVERS[system] || RETRIEVERS[BOOKING_SYSTEMS.accelAero]

  try {
    return await retrieve({
      pnr: String(pnr || '').trim().toUpperCase(),
      lastName: String(lastName || '').trim().toUpperCase(),
      language,
    })
  } catch (error) {
    return {
      ok: false,
      alert: { title: null, description: null },
      timedOut: error?.name === 'AbortError',
    }
  }
}
