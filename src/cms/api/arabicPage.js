/**
 * Arabic pages use the same component set as English.
 *
 * Components are stored per language. When Arabic is missing a block that
 * English has, that English block is copied into the Arabic page (same type,
 * same content) so every page has an Arabic version. Blocks Arabic already
 * has are kept. Alignment tokens on copied blocks flip left/right so they
 * follow the Arabic reading direction; the document `dir` is set to rtl by i18n.
 */

const ALIGN_KEY = /Align$/

function blockOrder(block) {
  return block?.order ?? block?.position ?? 0
}

function byPosition(a, b) {
  return blockOrder(a) - blockOrder(b)
}

function localeObject(map, lang) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) return {}
  const value = map[lang]
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  const first = Object.values(map).find(
    (item) => item && typeof item === 'object' && !Array.isArray(item),
  )
  return first || {}
}

/** `left` is the reading start in English, so it becomes `right` in Arabic. */
function mirrorForRtl(value, key) {
  if (Array.isArray(value)) return value.map((item) => mirrorForRtl(item))
  if (!value || typeof value !== 'object') {
    if (typeof value !== 'string') return value
    if (key !== 'objectPosition' && key !== 'align' && !ALIGN_KEY.test(key || '')) {
      return value
    }
    return value
      .replace(/\bleft\b/g, '\u0000')
      .replace(/\bright\b/g, 'left')
      .replace(/\u0000/g, 'right')
  }
  const out = {}
  for (const [childKey, child] of Object.entries(value)) {
    out[childKey] = mirrorForRtl(child, childKey)
  }
  return out
}

function englishAsArabicBlock(block, index) {
  return {
    ...block,
    uid: `ar-en:${block.uid}`,
    linkId: null,
    position: index,
    order: index,
    languages: ['ar'],
    content: { ar: structuredClone(localeObject(block.content, 'en')) },
    style: { ar: mirrorForRtl(structuredClone(localeObject(block.style, 'en'))) },
  }
}

function countsByType(blocks) {
  const counts = new Map()
  for (const block of blocks) {
    counts.set(block.sectionId, (counts.get(block.sectionId) || 0) + 1)
  }
  return counts
}

/**
 * True when this Arabic page is its own version: it uses a component English
 * does not have. Those pages are left as authored.
 */
function arabicHasOwnComponents(englishBlocks, arabicBlocks) {
  const english = countsByType(englishBlocks)
  for (const type of countsByType(arabicBlocks).keys()) {
    if (!english.has(type)) return true
  }
  return false
}

/**
 * Arabic block list for one page.
 *
 * An empty Arabic page becomes the English components. When Arabic already
 * uses those same component types, each English block keeps its Arabic match
 * and any English block without one is copied in. An Arabic page that uses
 * different components is left as it was authored.
 */
export function arabicBlocksFromEnglish(englishBlocks = [], arabicBlocks = []) {
  const english = [...englishBlocks].sort(byPosition)
  const arabic = [...arabicBlocks].sort(byPosition)
  if (arabic.length === 0) {
    return english.map((block, index) => englishAsArabicBlock(block, index))
  }
  if (arabicHasOwnComponents(english, arabic)) return arabic

  const englishCounts = countsByType(english)
  const arabicCounts = countsByType(arabic)
  let missing = false
  for (const [type, count] of englishCounts) {
    if ((arabicCounts.get(type) || 0) < count) missing = true
  }
  if (!missing) return arabic

  const used = new Set()
  const merged = []
  for (const block of english) {
    const match = arabic.find(
      (candidate) => !used.has(candidate.uid) && candidate.sectionId === block.sectionId,
    )
    if (match) {
      used.add(match.uid)
      merged.push(match)
    } else {
      merged.push(englishAsArabicBlock(block, merged.length))
    }
  }
  for (const extra of arabic) {
    if (!used.has(extra.uid)) merged.push(extra)
  }
  return merged.map((block, index) => ({ ...block, order: index, position: index }))
}

/** Page payload for `lang=ar`, filled from the English components where needed. */
export function withArabicPage(arabicPage, englishPage) {
  if (!arabicPage) return arabicPage
  const blocks = arabicBlocksFromEnglish(englishPage?.blocks, arabicPage.blocks)
  return {
    ...arabicPage,
    blocks,
    meta: {
      ...(arabicPage.meta || {}),
      lang: 'ar',
      dir: 'rtl',
      blockCount: blocks.length,
    },
  }
}
