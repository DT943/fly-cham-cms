import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/**
 * Map a CMS "magazine-view" block to <MagazineView /> — title, flipbook pages,
 * and the PDF download.
 */
export function magazineViewProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const pages = Array.isArray(content.pages) ? content.pages : []

  return {
    title: content.title || '',
    description: content.description || '',
    prevLabel: content.prevLabel || '',
    nextLabel: content.nextLabel || '',
    downloadLabel: content.downloadLabel || '',
    pageOfLabel: content.pageOfLabel || '',
    spreadOfLabel: content.spreadOfLabel || '',
    fullscreenLabel: content.fullscreenLabel || '',
    exitFullscreenLabel: content.exitFullscreenLabel || '',
    pdfUrl: content.pdfUrl || '',
    pdfFilename: content.pdfFilename || '',
    pages: pages.map((page) => ({
      id: page?.id || '',
      src: resolveCmsAsset(page?.imageUrl) || '',
      alt: page?.imageAlt || '',
    })),
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'descriptionColor',
  'descriptionFontWeight',
  'descriptionColorHover',
  'descriptionFontWeightHover',
  'buttonBg',
  'buttonHoverBg',
  'buttonText',
  'buttonTextFontWeight',
  'buttonTextHover',
  'buttonTextFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
