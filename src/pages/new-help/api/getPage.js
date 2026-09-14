import cmsClient from './cmsClient.js'

/**
 * Fetch a CMS page (with its ordered blocks) by slug.
 *
 *   GET /api/public/get-page?slug=<slug>
 *
 * Returns the raw page payload: { id, slug, blocks: [...], meta, ... }.
 */
export async function getPage(slug) {
  const { data } = await cmsClient.get('/api/public/get-page', {
    params: { slug },
  })
  return data
}
