/**
 * Code-driven header data. The mega menus themselves are CMS-driven — see
 * useSiteHeader.js (API document, bundled fallback in defaultHeader.json).
 */
// Flags live in the cms-media bucket (flags/<code>.svg).
const FLAGS_URL =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/flags'
const flag = (code) => `${FLAGS_URL}/${code}.svg`

/**
 * Country/region picker shown under the "SY" control. `langs` lists the
 * languages offered for that region (matches the app's supported locales).
 * `global` renders the globe icon instead of a flag.
 */
export const regions = [
  { id: 'syria', code: 'SY', flag: flag('sy'), currency: 'SYP', langs: ['en', 'ar'] },
  { id: 'uae', code: 'AE', flag: flag('ae'), currency: 'AED', langs: ['en', 'ar'] },
  { id: 'kuwait', code: 'KW', flag: flag('kw'), currency: 'KWD', langs: ['en', 'ar'] },
  { id: 'iraq', code: 'IQ', flag: flag('iq'), currency: 'IQD', langs: ['en', 'ar'] },
  { id: 'oman', code: 'OM', flag: flag('om'), currency: 'OMR', langs: ['en', 'ar'] },
  { id: 'turkey', code: 'TR', flag: flag('tr'), currency: 'TRY', langs: ['en', 'ar'] },
  { id: 'libya', code: 'LY', flag: flag('ly'), currency: 'LYD', langs: ['en', 'ar'] },
  { id: 'saudiArabia', code: 'SA', flag: flag('sa'), currency: 'SAR', langs: ['en', 'ar'] },
  { id: 'armenia', code: 'AM', flag: flag('am'), currency: 'AMD', langs: ['en'] },
  { id: 'global', code: 'GL', global: true, currency: 'USD', langs: ['en', 'ar'] },
]

