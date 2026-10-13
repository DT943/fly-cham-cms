import { pick, pickContent, resolveCmsHref } from './pick.js'
import { LABEL_KEYS } from '../../shared/booking-search/labels.js'

const text = (colorKey) => {
  const weightKey = colorKey.endsWith('Color') ? colorKey.replace(/Color$/, 'FontWeight') : `${colorKey}FontWeight`
  return [colorKey, weightKey, `${colorKey}Hover`, `${weightKey}Hover`]
}

// == Object.keys(DEFAULT_BOOKING_SEARCH_STYLE) in flychamadmin cms2 BookingSearch/utils/defaults.js.
const STYLE_KEYS = [
  'offsetY',
  'offsetYMobile',
  'showManageTab',
  'showFlightStatusTab',
  'showMultiCity',
  'showMilesToggle',
  'showNearby',
  'cardBg',
  'fieldBg',
  'accentColor',
  'iconBg',
  'iconColor',
  'buttonBg',
  'buttonBgHover',
  ...text('buttonText'),
]

/**
 * CMS "booking-search" block → <BookingSearch />. Stored content is the flat
 * label map (bookTab, roundTripLabel, fromLabel, … flightStatusHref,
 * defaultOrigin); style carries the offsets, toggles and colours.
 */
export function bookingSearchProps(block, lang) {
  const content = pickContent(block.content, lang)
  const labels = Object.fromEntries(
    LABEL_KEYS.filter((key) => typeof content[key] === 'string').map((key) => [key, content[key]]),
  )
  if (labels.flightStatusHref) labels.flightStatusHref = resolveCmsHref(labels.flightStatusHref)
  return {
    content: labels,
    style: pick(block.style || {}, STYLE_KEYS),
  }
}
