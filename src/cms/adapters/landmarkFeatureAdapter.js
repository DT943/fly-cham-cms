import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "landmark-feature" block to <LandmarkFeature /> props — one or more
 * landmark cards, each a photo + copy side by side closed by a thumbnail
 * carousel. Each card keeps its own side (`imageFirst`), banner and thumbnails.
 * Images come only from the CMS; an empty image renders nothing.
 */
export function landmarkFeatureProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  // Shared copy lives on the block; empty strings hide the heading. Fall back
  // to per-item copy only for legacy blocks that never stored top-level fields.
  const sharedTitle = typeof content.title === 'string' ? content.title : null
  const sharedDescription =
    typeof content.description === 'string' ? content.description : null

  return {
    items: (Array.isArray(content.items) ? content.items : []).map((it) => ({
      id: it?.id || '',
      title: sharedTitle !== null ? sharedTitle : it?.title || '',
      description:
        sharedDescription !== null ? sharedDescription : it?.description || '',
      image: resolveCmsAsset(it?.imageUrl) || undefined,
      imageAlt: it?.imageAlt || '',
      imageFirst: it?.imageFirst === true,
      thumbnails: (Array.isArray(it?.thumbnails) ? it.thumbnails : [])
        .map((thumb) => ({
          url: resolveCmsAsset(thumb?.url) || '',
          alt: thumb?.alt || '',
        }))
        .filter((thumb) => thumb.url),
    })),
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
  'imageRadius',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'bodyColor',
  'bodyFontWeight',
  'bodyColorHover',
  'bodyFontWeightHover',
  'showCarousel',
  'carouselBg',
  'arrowBg',
  'arrowColor',
  'activeBorderColor',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
