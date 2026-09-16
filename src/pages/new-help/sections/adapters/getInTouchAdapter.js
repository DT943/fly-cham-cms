import { pick, pickContent, resolveCmsAsset } from './pick.js'

/**
 * Map a CMS "get-in-touch" block to <GetInTouch /> props.
 *
 * `contained` is false because NewHelp already wraps blocks in Container.
 */
export function getInTouchProps(block, lang) {
  const content = pickContent(block.content, lang)
  const style = block.style || {}

  return {
    title: content.title,
    label: content.label,
    phoneDisplay: content.phoneDisplay,
    phoneHref: content.phoneHref,
    hours: content.hours,
    note: content.note,
    image: resolveCmsAsset(content.imageUrl) || undefined,
    imageAlt: content.imageAlt,
    contained: false,
    ...pick(style, STYLE_KEYS),
  }
}

const STYLE_KEYS = [
  'showNote',
  'noteColor',
  'showHours',
  'showImage',
  'showLabel',
  'showPhone',
  'showTitle',
  'hoursColor',
  'labelColor',
  'phoneColor',
  'titleColor',
  'showSectionBg',
  'sectionBg',
  'sectionPadding',
  'phoneFontWeight',
  'titleFontWeight',
  'titleColorHover',
  'titleFontWeightHover',
  'labelColorHover',
  'labelFontWeightHover',
  'phoneColorHover',
  'phoneFontWeightHover',
  'hoursColorHover',
  'hoursFontWeightHover',
  'noteColorHover',
  'noteFontWeightHover',
]
