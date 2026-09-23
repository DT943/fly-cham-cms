import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "track-request" block to <TrackRequest /> props — a two-column
 * "Continue an existing request" block (side photo + case-tracking form).
 *
 * - Content is language-scoped (`block.content[lang]`); falls back to the first
 *   available language when the current one is missing.
 * - The block stores the editor shape: `{ title, subtitle, caseLabel,
 *   casePlaceholder, nameLabel, namePlaceholder, submitLabel, imageUrl,
 *   imageAlt, links }` (with a nested `image` fallback).
 * - Only the style keys the CMS actually provided are forwarded, so any omitted
 *   key falls through to TrackRequest's own default (the Figma look).
 */
export function trackRequestProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    subtitle: content.subtitle || '',
    caseLabel: content.caseLabel || '',
    casePlaceholder: content.casePlaceholder || '',
    nameLabel: content.nameLabel || '',
    namePlaceholder: content.namePlaceholder || '',
    submitLabel: content.submitLabel || '',
    image: resolveCmsAsset(content.imageUrl ?? content.image?.fileUrl) || undefined,
    imageAlt: content.imageAlt ?? content.image?.alt ?? '',
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'showTitle',
  'showSubtitle',
  'showImage',
  'imagePosition',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'titleAlign',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'labelColor',
  'labelFontWeight',
  'labelColorHover',
  'labelFontWeightHover',
  'inputBg',
  'submitBg',
  'submitBgHover',
  'submitTextColor',
  'submitTextFontWeight',
  'submitTextColorHover',
  'submitTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
