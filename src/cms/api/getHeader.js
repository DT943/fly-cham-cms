import cmsClient from './cmsClient.js'

/**
 * Fetch the site header document for one language.
 *
 *   GET /api/public/get-header?lang=<en|ar>
 *
 * Resolves to `{ lang, document, version, updatedAt }` (the response's `data`).
 * Rejects on network errors / non-2xx (404 = no document saved yet).
 */
export async function getHeader(lang, { signal } = {}) {
  const { data } = await cmsClient.get('/api/public/get-header', {
    params: { lang },
    timeout: 10000,
    signal,
  })
  return data?.data ?? null
}
