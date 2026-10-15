/** Booking points of sale. `all` is the default and includes every payment method. */
export const GATEWAY_POS_OPTIONS = [
  { value: 'all', en: 'All', ar: 'الكل' },
  { value: 'sy', en: 'Syria', ar: 'سوريا' },
  { value: 'ae', en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
  { value: 'sa', en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
  { value: 'kw', en: 'Kuwait', ar: 'الكويت' },
  { value: 'iq', en: 'Iraq', ar: 'العراق' },
  { value: 'om', en: 'Oman', ar: 'عُمان' },
  { value: 'tr', en: 'Turkey', ar: 'تركيا' },
  { value: 'am', en: 'Armenia', ar: 'أرمينيا' },
  { value: 'ly', en: 'Libya', ar: 'ليبيا' },
]

const ALLOWED = new Set(GATEWAY_POS_OPTIONS.map((option) => option.value))

export function normalizePos(pos) {
  const codes = (Array.isArray(pos) ? pos : [])
    .map((code) => {
      const value = String(code || '').trim().toLowerCase()
      return value === 'gb' ? 'all' : value
    })
    .filter((code) => ALLOWED.has(code))
  if (!codes.includes('all')) codes.unshift('all')
  return [...new Set(codes)]
}

export function defaultPosLabel(code, lang = 'en') {
  const option = GATEWAY_POS_OPTIONS.find((item) => item.value === code)
  if (!option) return code
  return String(lang).toLowerCase() === 'ar' ? option.ar : option.en
}

/** Saved label for this language, or the built-in name when it is blank. */
export function posLabel(code, lang = 'en', labels) {
  const custom = labels && typeof labels === 'object' ? String(labels[code] ?? '').trim() : ''
  return custom || defaultPosLabel(code, lang)
}

/** With the filter on, a method shows only for the points of sale that are checked. */
export function cardMatchesPos(item, pos, filterByPos) {
  if (!filterByPos) return true
  return normalizePos(item?.pos).includes(pos)
}
