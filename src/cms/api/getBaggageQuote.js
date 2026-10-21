import cmsClient from './cmsClient.js'

/**
 * Excess baggage price for a route + weight, computed by the CMS backend from
 * the admin's USD price per kg (baggage_segment_prices).
 *
 *   GET /api/public/baggage-prices/quote?from=&to=&weight=
 *
 * `from` / `to` are POS codes (e.g. sy, ae) or airport codes (e.g. DAM).
 * Resolves to `{ origin, destination, weightKg, pricePerKgUsd, totalUsd, currency }`,
 * or `null` when no price is set for that route yet (404 not_priced).
 */
export async function getBaggageQuote({ from, to, weight }, { signal } = {}) {
  try {
    const { data } = await cmsClient.get('/api/public/baggage-prices/quote', {
      params: { from, to, weight },
      timeout: 10000,
      signal,
    })
    return data?.data ?? null
  } catch (error) {
    if (error?.response?.data?.error?.code === 'not_priced') return null
    throw error
  }
}
