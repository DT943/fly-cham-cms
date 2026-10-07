/** @typedef {{ label: string, value: string, displayLabel?: string, countryName?: string }} PhoneCountryOption */

const ISO_ALPHA2 = (() => {
  const codes = [];
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      codes.push(String.fromCharCode(a) + String.fromCharCode(b));
    }
  }
  return codes;
})();

/** English labels in `countries.js` that do not match `Intl.DisplayNames('en')` verbatim. */
const ENGLISH_NAME_TO_ISO = {
  'Syrian Arab Republic': 'SY',
  'Antigua and Barbuda': 'AG',
  'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  'Trinidad and Tobago': 'TT',
  'Saint Kitts and Nevis': 'KN',
  "Côte d'Ivoire": 'CI',
  'Cabo Verde': 'CV',
  'Sao Tome and Principe': 'ST',
  Congo: 'CG',
  'Congo, The Democratic Republic of the': 'CD',
  'Tanzania, United Republic of': 'TZ',
  'Moldova, Republic of': 'MD',
  // Nested-paren / older list labels + current Intl names
  'Holy See (Vatican City State)': 'VA',
  'Holy See (Vatican City State': 'VA',
  'Vatican City State': 'VA',
  'Vatican City': 'VA',
  Turkey: 'TR',
  Türkiye: 'TR',
  Turkiye: 'TR',
  Palestine: 'PS',
  Palestinian: 'PS',
  'Palestinian Territories': 'PS',
  'Palestinian Territory, Occupied': 'PS',
  'Bosnia and Herzegovina': 'BA',
  'Iran, Islamic Republic of': 'IR',
  'Korea, Republic of': 'KR',
  "Korea, Democratic People's Republic of": 'KP',
  "Lao People's Democratic Republic": 'LA',
  'Micronesia, Federated States of': 'FM',
  'Russian Federation': 'RU',
  'Taiwan, Province of China': 'TW',
  'United States': 'US',
  'United Kingdom': 'GB',
  'Venezuela, Bolivarian Republic of': 'VE',
  'Viet Nam': 'VN',
  'Bolivia, Plurinational State of': 'BO',
  'Brunei Darussalam': 'BN',
  'Virgin Islands, British': 'VG',
  'Virgin Islands, U.S.': 'VI',
  Bahamas: 'BS',
  Bermuda: 'BM',
  'Dominican Republic': 'DO',
  'American Samoa': 'AS',
  Anguilla: 'AI',
  Barbados: 'BB',
  Dominica: 'DM',
  Grenada: 'GD',
  Jamaica: 'JM',
  'South Sudan': 'SS',
  'North Macedonia': 'MK',
  Eswatini: 'SZ',
  'Timor-Leste': 'TL',
};

let englishToIsoCache = null;
let arabicRegionNames = null;

function getEnglishToIsoMap() {
  if (englishToIsoCache) return englishToIsoCache;

  const map = { ...ENGLISH_NAME_TO_ISO };
  const displayEn = new Intl.DisplayNames(['en'], { type: 'region' });

  for (const code of ISO_ALPHA2) {
    try {
      const name = displayEn.of(code);
      if (name && !map[name]) map[name] = code;
    } catch {
      /* invalid region code */
    }
  }

  englishToIsoCache = map;
  return map;
}

function getArabicRegionNames() {
  if (!arabicRegionNames) {
    arabicRegionNames = new Intl.DisplayNames(['ar'], { type: 'region' });
  }
  return arabicRegionNames;
}

/** @param {string} label e.g. "963 (Syrian Arab Republic)" or nested "379 (Holy See (Vatican City State))" */
export function extractCountryNameFromParenLabel(label) {
  const s = String(label ?? '').trim();
  const open = s.indexOf('(');
  const close = s.lastIndexOf(')');
  if (open !== -1 && close > open) {
    return s.slice(open + 1, close).trim();
  }
  return s;
}

/** @param {string} label e.g. "963 (Syrian Arab Republic)" */
export function parsePhoneCountryLabel(label) {
  const s = String(label ?? '').trim();
  const open = s.indexOf('(');
  const close = s.lastIndexOf(')');
  if (open === -1 || close <= open) {
    return { code: '', countryName: s };
  }
  const code = s.slice(0, open).trim();
  const countryName = s.slice(open + 1, close).trim();
  if (!/^[\d-]+$/.test(code)) {
    return { code: '', countryName: s };
  }
  return { code, countryName };
}

/** @param {string} englishName */
export function getIsoFromEnglishCountryName(englishName) {
  return getEnglishToIsoMap()[englishName] ?? null;
}

/** @param {string} englishName */
export function getArabicCountryName(englishName) {
  const iso = getIsoFromEnglishCountryName(englishName);
  if (!iso) return englishName;
  try {
    return getArabicRegionNames().of(iso) ?? englishName;
  } catch {
    return englishName;
  }
}

/**
 * Phone country row label for display.
 * LTR: `963 (Syria)` — RTL: `سورية (963)` with an LTR isolate on the code.
 */
export function formatPhoneCountryLabel(label, { rtl = false, locale = 'en' } = {}) {
  const { code, countryName } = parsePhoneCountryLabel(label);
  if (!code) return label;

  const name =
    locale === 'ar' || rtl ? getArabicCountryName(countryName) : countryName;
  const isolatedCode = `\u200E${code}\u200E`;

  if (rtl) return `${name} (${isolatedCode})`;
  return `${code} (${name})`;
}

/**
 * @param {PhoneCountryOption[]} options
 * @param {{ locale?: string }} config
 * @returns {PhoneCountryOption[]}
 */
export function mapNationalityOptions(options, { locale = 'en' } = {}) {
  if (locale !== 'ar' && !String(locale).startsWith('ar')) return options;

  return options.map((opt) => {
    // Prefer static Arabic labels from countries.js when present
    if (opt.labelAr) {
      const arName = extractCountryNameFromParenLabel(opt.labelAr);
      if (arName) {
        return { ...opt, displayLabel: arName };
      }
    }
    const englishName = String(opt.countryName ?? opt.value ?? opt.label ?? '').trim();
    if (!englishName) return opt;
    return {
      ...opt,
      displayLabel: getArabicCountryName(englishName),
    };
  });
}

/**
 * @param {PhoneCountryOption[]} options
 * @param {{ rtl?: boolean, locale?: string }} config
 * @returns {PhoneCountryOption[]}
 */
export function mapPhoneCountryOptions(options, { rtl = false, locale = 'en' } = {}) {
  if (!rtl && locale !== 'ar') return options;

  return options.map((opt) => {
    const { countryName } = parsePhoneCountryLabel(opt.label);
    const displayLabel = formatPhoneCountryLabel(opt.label, { rtl: true, locale: 'ar' });
    return {
      ...opt,
      countryName,
      displayLabel,
    };
  });
}
