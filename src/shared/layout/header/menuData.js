/**
 * Code-driven header data. The mega menus themselves are CMS-driven — see
 * useSiteHeader.js (API document, bundled fallback in defaultHeader.json).
 */
import syFlag from '../../../assets/images/flags/sy.svg'
import aeFlag from '../../../assets/images/flags/ae.svg'
import kwFlag from '../../../assets/images/flags/kw.svg'
import iqFlag from '../../../assets/images/flags/iq.svg'
import omFlag from '../../../assets/images/flags/om.svg'
import trFlag from '../../../assets/images/flags/tr.svg'
import lyFlag from '../../../assets/images/flags/ly.svg'
import saFlag from '../../../assets/images/flags/sa.svg'
import amFlag from '../../../assets/images/flags/am.svg'

/**
 * Country/region picker shown under the "SY" control. `langs` lists the
 * languages offered for that region (matches the app's supported locales).
 * `global` renders the globe icon instead of a flag.
 */
export const regions = [
  { id: 'syria', code: 'SY', flag: syFlag, langs: ['en', 'ar'] },
  { id: 'uae', code: 'AE', flag: aeFlag, langs: ['en', 'ar'] },
  { id: 'kuwait', code: 'KW', flag: kwFlag, langs: ['en', 'ar'] },
  { id: 'iraq', code: 'IQ', flag: iqFlag, langs: ['en', 'ar'] },
  { id: 'oman', code: 'OM', flag: omFlag, langs: ['en', 'ar'] },
  { id: 'turkey', code: 'TR', flag: trFlag, langs: ['en', 'ar'] },
  { id: 'libya', code: 'LY', flag: lyFlag, langs: ['en', 'ar'] },
  { id: 'saudiArabia', code: 'SA', flag: saFlag, langs: ['en', 'ar'] },
  { id: 'armenia', code: 'AM', flag: amFlag, langs: ['en'] },
  { id: 'global', code: 'GL', global: true, langs: ['en', 'ar'] },
]

