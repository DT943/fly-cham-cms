/**
 * Content fixes applied on top of CMS page blocks, for values the saved CMS
 * content gets wrong. Remove an entry once the CMS has been corrected.
 *
 * Each rule targets one page slug + section and patches the matching blocks'
 * content in every language.
 */

const CARGO_GUIDE_HREF = '/cargo/cargo-guide'
const isCargoGuideBanner = (content) => String(content?.imageUrl || '').includes('/cargo-service/guide.')

const RULES = [
  // "Explore Cargo Guide" banners link to the Cargo Guide magazine.
  { slug: 'cargo', sectionId: 'cta-banner', match: isCargoGuideBanner, patch: { buttonHref: CARGO_GUIDE_HREF } },
  {
    slug: 'cargo-stations',
    sectionId: 'promo-banner',
    match: isCargoGuideBanner,
    patch: { buttonHref: CARGO_GUIDE_HREF },
  },
]

const patchBlock = (block, rule) => {
  const content = block.content || {}
  const patched = Object.fromEntries(
    Object.entries(content).map(([lang, value]) => [lang, rule.match(value) ? { ...value, ...rule.patch } : value]),
  )
  return { ...block, content: patched }
}

/** `blocks` for page `slug` with every matching override applied. */
export const applyPageBlockOverrides = (slug, blocks) => {
  const rules = RULES.filter((rule) => rule.slug === slug)
  if (!rules.length || !Array.isArray(blocks)) return blocks
  return blocks.map((block) =>
    rules.reduce((current, rule) => (current.sectionId === rule.sectionId ? patchBlock(current, rule) : current), block),
  )
}
