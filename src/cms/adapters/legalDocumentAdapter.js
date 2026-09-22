import { pick, pickContent, resolveCmsHref } from './pick.js'

function asTextList(list) {
  if (!Array.isArray(list)) return []
  return list
    .map((item) => (typeof item === 'string' ? item : item?.text || ''))
    .filter(Boolean)
}

function mapBlock(block) {
  return {
    type: block?.type || 'p',
    text: block?.text || '',
    items: asTextList(block?.items),
  }
}

function mapSection(section, index) {
  return {
    id: section?.id || `legal-section-${index + 1}`,
    variant: section?.variant || 'card',
    title: section?.title || '',
    body: section?.body || '',
    note: section?.note || '',
    items: asTextList(section?.items),
    blocks: (Array.isArray(section?.blocks) ? section.blocks : []).map(mapBlock),
    methods: (Array.isArray(section?.methods) ? section.methods : []).map((method) => ({
      title: method?.title || '',
      body: method?.body || '',
    })),
    cards: (Array.isArray(section?.cards) ? section.cards : []).map((card) => ({
      title: card?.title || '',
      body: card?.body || '',
      note: card?.note || '',
    })),
    company: section?.company || '',
    department: section?.department || '',
    emailLabel: section?.emailLabel || '',
    email: section?.email || '',
    phoneLabel: section?.phoneLabel || '',
    phone: section?.phone || '',
  }
}

/**
 * Map a CMS "legal-document" block to <LegalDocument />.
 */
export function legalDocumentProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}
  const contact = content.contact || {}

  return {
    layout: content.layout || 'sidebar',
    showNav: content.showNav !== false,
    navItems: (content.navItems || []).map((item) => ({
      id: item.id || '',
      label: item.label || '',
      href: item.href ? resolveCmsHref(item.href) : '',
    })),
    activeId: content.activeId || '',
    dateLine: content.dateLine || '',
    introTitle: content.introTitle || '',
    introBody: content.introBody || '',
    introParagraphs: asTextList(content.introParagraphs),
    introBullets: asTextList(content.introBullets),
    introAfter: content.introAfter || '',
    summaryTitle: content.summaryTitle || '',
    summaryIntro: content.summaryIntro || '',
    summaryPoints: asTextList(content.summaryPoints),
    tocTitle: content.tocTitle || '',
    tocItems: (content.tocItems || []).map((item, index) =>
      typeof item === 'string'
        ? { text: item, href: `#legal-section-${index + 1}` }
        : {
            text: item?.text || '',
            href: item?.href || `#legal-section-${index + 1}`,
          },
    ),
    inShortLabel: content.inShortLabel || '',
    sections: (content.sections || []).map(mapSection),
    contact: {
      variant: contact.variant || 'links',
      title: contact.title || '',
      intro: contact.intro || '',
      emailLabel: contact.emailLabel || '',
      email: contact.email || '',
      phoneLabel: contact.phoneLabel || '',
      phone: contact.phone || '',
      company: contact.company || '',
      department: contact.department || '',
    },
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}

function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const STYLE_KEYS = [
  'columnGap',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'titleColor',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'subtitleColor',
  'subtitleFontWeight',
  'subtitleColorHover',
  'subtitleFontWeightHover',
  'cardTitleColor',
  'cardTitleFontWeight',
  'cardTitleColorHover',
  'cardTitleFontWeightHover',
  'cardDescriptionColor',
  'cardDescriptionFontWeight',
  'cardDescriptionColorHover',
  'cardDescriptionFontWeightHover',
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]
