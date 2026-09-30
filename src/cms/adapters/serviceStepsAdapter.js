import { pick, pickContent, resolveCmsAsset, resolveCmsHref } from './pick.js'

/** Resolve each backlink href through the app's CMS href rules. */
function mapBacklinks(links) {
  if (!Array.isArray(links)) return []
  return links.map((link) => ({ ...link, href: resolveCmsHref(link?.href) }))
}

const text = (colorKey) => {
  const weightKey = colorKey.endsWith('Color')
    ? colorKey.replace(/Color$/, 'FontWeight')
    : `${colorKey}FontWeight`
  return [colorKey, weightKey, `${colorKey}Hover`, `${weightKey}Hover`]
}

// Union of Object.keys(DEFAULT_SERVICE_STEPS_STYLE) in cms2.
const STYLE_KEYS = [
  'imageSide',
  'imageRadius',
  'showImage',
  'sectionPadding',
  'showSectionBg',
  'sectionBg',
  'showDescription',
  ...text('titleColor'),
  ...text('bodyColor'),
  'showSteps',
  'stepMarker',
  'markerBg',
  ...text('numberColor'),
  ...text('stepTitleColor'),
  ...text('stepDescriptionColor'),
  'showButton',
  'showButtonIcon',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
  'showLinks',
  'linkColor',
  'linkHoverColor',
  'linkFontWeight',
  'linkUnderline',
  'linkItalic',
]

/**
 * Map a CMS "service-steps" block to <ServiceSteps /> props.
 * Stored editor shape: `{ title, description, imageUrl, imageAlt,
 * steps[{ id, icon, title, description }], buttonLabel, buttonHref,
 * buttonIcon, links }` — icons are Phosphor names.
 */
export function serviceStepsProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title || '',
    description: content.description || '',
    imageUrl: resolveCmsAsset(content.imageUrl) || '',
    imageAlt: content.imageAlt || '',
    steps: (Array.isArray(content.steps) ? content.steps : []).map((step) => ({
      id: step?.id || '',
      icon: step?.icon || '',
      title: step?.title || '',
      description: step?.description || '',
    })),
    buttonLabel: content.buttonLabel || '',
    buttonHref: resolveCmsHref(content.buttonHref) || '',
    buttonIcon: content.buttonIcon || '',
    links: mapBacklinks(content.links),
    ...pick(style, STYLE_KEYS),
  }
}
