/** Booking points of sale. `gb` is the Global point of sale. */
export const GATEWAY_POS_OPTIONS = [
  { value: 'sy', en: 'Syria', ar: 'سوريا' },
  { value: 'ae', en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
  { value: 'sa', en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
  { value: 'kw', en: 'Kuwait', ar: 'الكويت' },
  { value: 'iq', en: 'Iraq', ar: 'العراق' },
  { value: 'om', en: 'Oman', ar: 'عُمان' },
  { value: 'tr', en: 'Turkey', ar: 'تركيا' },
  { value: 'am', en: 'Armenia', ar: 'أرمينيا' },
  { value: 'ly', en: 'Libya', ar: 'ليبيا' },
  { value: 'gb', en: 'Global', ar: 'عالمي' },
]

const ALLOWED = new Set(GATEWAY_POS_OPTIONS.map((option) => option.value))

export function normalizePos(pos) {
  if (!Array.isArray(pos)) return []
  const codes = pos
    .map((code) => String(code || '').trim().toLowerCase())
    .filter((code) => ALLOWED.has(code))
  return [...new Set(codes)]
}

/** A card with no point of sale stays visible for every selection. */
export function cardMatchesPos(item, pos, filterByPos) {
  if (!filterByPos) return true
  const codes = normalizePos(item?.pos)
  if (!codes.length) return true
  return codes.includes(pos)
}
