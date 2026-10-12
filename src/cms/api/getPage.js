import cmsClient from './cmsClient.js'
import { withArabicPage } from './arabicPage.js'

async function fetchPage(slug, lang) {
  const { data } = await cmsClient.get('/api/public/get-page', {
    params: { slug, ...(lang ? { lang } : {}), _: Date.now() },
  })
  return data
}

/**
 * Fetch a CMS page (with its ordered blocks) by slug.
 *
 *   GET /api/public/get-page?slug=<slug>[&lang=<lang>]
 *
 * Components are stored per language, so `lang` selects which language's blocks
 * come back (without it the API returns every language's blocks mixed together).
 *
 * Arabic (`lang=ar`) is filled from the English component set when Arabic is
 * missing blocks, so every page has an Arabic version. RTL is `meta.dir`.
 *
 * Returns the raw page payload: { id, slug, blocks: [...], meta, ... }.
 */
export async function getPage(slug, lang) {
  if (lang !== 'ar') return fetchPage(slug, lang)

  const arabic = await fetchPage(slug, 'ar')
  let english = null
  try {
    english = await fetchPage(slug, 'en')
  } catch {
    return withArabicPage(arabic, null)
  }
  return withArabicPage(arabic, english)
}
