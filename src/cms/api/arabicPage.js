/**
 * Arabic pages use the same component set as English.
 *
 * Missing Arabic blocks are copied from English. Arabic blocks that already
 * exist keep their structure, and any text that is still English is replaced
 * from the Arabic translations. Physical image positions flip for RTL; text
 * alignment stays logical (`left` is the reading start) because the document
 * direction is rtl.
 */

import en from '../../i18n/locales/en.json' with { type: 'json' }
import ar from '../../i18n/locales/ar.json' with { type: 'json' }
import { ARABIC_PHRASES } from './arabicPhrases.js'

const ARABIC_SCRIPT = /[\u0600-\u06FF]/
const ALIGN_KEY = /Align$/
const ALT_KEYS = new Set(['alt', 'imageAlt', 'imagealt'])
const PHYSICAL_KEYS = new Set(['objectPosition', 'imagePosition', 'backgroundPosition'])

const PHRASES = buildPhraseMap()

function normalizePhrase(value) {
  return String(value).trim().replace(/\s+/g, ' ').replace(/[’']/g, "'").toLowerCase()
}

function buildPhraseMap() {
  const map = new Map()
  const walk = (enNode, arNode) => {
    if (typeof enNode === 'string' && typeof arNode === 'string') {
      const arabic = arNode.trim()
      if (arabic && ARABIC_SCRIPT.test(arabic)) map.set(normalizePhrase(enNode), arabic)
      return
    }
    if (!enNode || !arNode || typeof enNode !== 'object' || typeof arNode !== 'object') return
    if (Array.isArray(enNode) || Array.isArray(arNode)) {
      if (Array.isArray(enNode) && Array.isArray(arNode)) {
        enNode.forEach((item, index) => walk(item, arNode[index]))
      }
      return
    }
    for (const key of Object.keys(enNode)) {
      if (key in arNode) walk(enNode[key], arNode[key])
    }
  }
  walk(en, ar)
  for (const [english, arabic] of Object.entries(ARABIC_PHRASES)) {
    map.set(normalizePhrase(english), arabic)
  }
  return map
}

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

function translatePhrase(value) {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (!trimmed || ARABIC_SCRIPT.test(trimmed)) return value
  return PHRASES.get(normalizePhrase(trimmed)) || value
}

/** Emails, links, phones, and clock times stay as written. */
function keepLiteral(value) {
  const trimmed = value.trim()
  if (!trimmed) return true
  if (/^(https?:|mailto:|tel:)/i.test(trimmed) || trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return true
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true
  if (/^\+?[\d\s().-]{6,}$/.test(trimmed)) return true
  if (/^[\d:+./\-\s°]+$/.test(trimmed)) return true
  if (/^(utc|gmt)\s*[+-]?\d*$/i.test(trimmed)) return true
  return false
}

function arabicLabel(node) {
  if (!node || typeof node !== 'object') return ''
  for (const key of ['title', 'name', 'heading', 'label']) {
    const value = node[key]
    if (typeof value === 'string' && ARABIC_SCRIPT.test(value)) return value.trim()
  }
  return ''
}

/** Image descriptions that are still English use the item's Arabic title. */
function applyArabicAlts(node, inheritedTitle = '') {
  if (!node || typeof node !== 'object') return node
  if (Array.isArray(node)) {
    return node.map((item) => applyArabicAlts(item, arabicLabel(item) || inheritedTitle))
  }
  const title = arabicLabel(node) || inheritedTitle
  const out = { ...node }
  for (const key of Object.keys(out)) {
    const value = out[key]
    if (
      ALT_KEYS.has(key) &&
      title &&
      typeof value === 'string' &&
      value.trim() &&
      !ARABIC_SCRIPT.test(value)
    ) {
      out[key] = title
    } else if (value && typeof value === 'object') {
      out[key] = applyArabicAlts(value, title)
    }
  }
  return out
}

/**
 * Fill one Arabic content tree. Strings that are already Arabic stay.
 * English strings are replaced when a translation exists. Image alts with no
 * translation use the Arabic title of the same item.
 */
export function fillArabicContent(arabicNode, englishNode) {
  if (Array.isArray(arabicNode) || Array.isArray(englishNode)) {
    const arabicList = Array.isArray(arabicNode) ? arabicNode : []
    const englishList = Array.isArray(englishNode) ? englishNode : []
    const length = Math.max(arabicList.length, englishList.length)
    return Array.from({ length }, (_, index) =>
      fillArabicContent(arabicList[index], englishList[index]),
    )
  }

  const arabicObject =
    arabicNode && typeof arabicNode === 'object' ? arabicNode : null
  const englishObject =
    englishNode && typeof englishNode === 'object' && !Array.isArray(englishNode)
      ? englishNode
      : null

  if (arabicObject || englishObject) {
    const keys = new Set([
      ...Object.keys(arabicObject || {}),
      ...Object.keys(englishObject || {}),
    ])
    const draft = {}
    for (const key of keys) {
      draft[key] = fillArabicContent(
        arabicObject ? arabicObject[key] : undefined,
        englishObject ? englishObject[key] : undefined,
      )
    }
    return applyArabicAlts(draft)
  }

  if (typeof arabicNode === 'string' && ARABIC_SCRIPT.test(arabicNode)) return arabicNode
  const source =
    typeof arabicNode === 'string' && arabicNode.trim()
      ? arabicNode
      : typeof englishNode === 'string'
        ? englishNode
        : arabicNode
  if (typeof source !== 'string') return arabicNode ?? englishNode ?? ''
  if (keepLiteral(source)) return source
  return translatePhrase(source)
}

/** Flip physical left/right in image positions. Alignment tokens stay logical. */
function mirrorPhysical(value, key) {
  if (Array.isArray(value)) return value.map((item) => mirrorPhysical(item))
  if (!value || typeof value !== 'object') {
    if (typeof value !== 'string') return value
    if (!PHYSICAL_KEYS.has(key) && key !== 'objectPosition') return value
    return value
      .replace(/\bleft\b/g, '\u0000')
      .replace(/\bright\b/g, 'left')
      .replace(/\u0000/g, 'right')
  }
  const out = {}
  for (const [childKey, child] of Object.entries(value)) {
    if (ALIGN_KEY.test(childKey) || childKey === 'align') {
      out[childKey] = child
    } else {
      out[childKey] = mirrorPhysical(child, childKey)
    }
  }
  return out
}

function englishAsArabicBlock(block, index) {
  const content = structuredClone(localeObject(block.content, 'en'))
  const style = structuredClone(localeObject(block.style, 'en'))
  return {
    ...block,
    uid: `ar-en:${block.uid}`,
    linkId: null,
    position: index,
    order: index,
    languages: ['ar'],
    content: { ar: content },
    style: { ar: style },
  }
}

function countsByType(blocks) {
  const counts = new Map()
  for (const block of blocks) {
    counts.set(block.sectionId, (counts.get(block.sectionId) || 0) + 1)
  }
  return counts
}

function arabicHasOwnComponents(englishBlocks, arabicBlocks) {
  const english = countsByType(englishBlocks)
  for (const type of countsByType(arabicBlocks).keys()) {
    if (!english.has(type)) return true
  }
  return false
}

function assembleArabicBlocks(englishBlocks = [], arabicBlocks = []) {
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

/** Fill English leftovers and mirror physical positions on every Arabic block. */
export function localizeArabicBlocks(blocks = [], englishBlocks = []) {
  const english = [...englishBlocks].sort(byPosition)
  const used = new Set()
  return blocks.map((block) => {
    const match = english.find(
      (candidate) => !used.has(candidate.uid) && candidate.sectionId === block.sectionId,
    )
    if (match) used.add(match.uid)
    const arabicContent = localeObject(block.content, 'ar')
    const englishContent = match ? localeObject(match.content, 'en') : null
    const style = localeObject(block.style, 'ar')
    const hasStyle = style && Object.keys(style).length > 0
    return {
      ...block,
      languages: ['ar'],
      content: { ar: fillArabicContent(structuredClone(arabicContent), englishContent) },
      style: { ar: hasStyle ? mirrorPhysical(structuredClone(style)) : style },
    }
  })
}

/**
 * Arabic block list for one page. Existing Arabic components stay; missing
 * English components are copied, then every block's Arabic content is filled.
 */
export function arabicBlocksFromEnglish(englishBlocks = [], arabicBlocks = []) {
  const english = [...englishBlocks].sort(byPosition)
  return localizeArabicBlocks(assembleArabicBlocks(english, arabicBlocks), english)
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
