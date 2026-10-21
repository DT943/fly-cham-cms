import cmsClient from './cmsClient.js'

/**
 * Fetch the active POS list.
 *
 *   GET /api/public/pos-list
 *
 * Resolves to `[{ code, nameEn, nameAr, flagUrl, currency, languages, position }]`.
 * Rejects on network errors / non-2xx (404 = table not created yet).
 */
export async function getPosList({ signal } = {}) {
  const { data } = await cmsClient.get('/api/public/pos-list', {
    params: { _: Date.now() },
    timeout: 10000,
    signal,
  })
  return Array.isArray(data?.data) ? data.data : []
}
