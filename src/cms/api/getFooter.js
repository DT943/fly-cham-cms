import cmsClient from './cmsClient.js'

/**
 * Fetch the site footer document for one language.
 *
 *   GET /api/public/get-footer?lang=<en|ar>
 *
 * Resolves to `{ lang, document, version, updatedAt }` (the response's `data`).
 * Rejects on network errors / non-2xx (404 = no document saved yet).
 */
export async function getFooter(lang, { signal } = {}) {
  const { data } = await cmsClient.get('/api/public/get-footer', {
    // Unique query so a browser/CDN cached copy cannot hide a footer save.
    params: { lang, _: Date.now() },
    timeout: 10000,
    signal,
  })
  return data?.data ?? null
}
