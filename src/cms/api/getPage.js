import cmsClient from './cmsClient.js'

/**
 * Fetch a CMS page (with its ordered blocks) by slug.
 *
 *   GET /api/public/get-page?slug=<slug>[&lang=<lang>]
 *
 * Components are stored per language, so `lang` selects which language's blocks
 * come back (without it the API returns every language's blocks mixed together).
 *
 * Returns the raw page payload: { id, slug, blocks: [...], meta, ... }.
 */
export async function getPage(slug, lang) {
  const { data } = await cmsClient.get('/api/public/get-page', {
    params: { slug, ...(lang ? { lang } : {}), _: Date.now() },
  })
  return data
}
