import { fetchData } from '../../vendor/flycham/services/Api/apiService.js'
import { normalizeB2cLanguageCode } from '../../vendor/flycham/util/b2cLanguageCode.js'

export const CURRENCIES_QUERY_KEY = 'booking-search-currencies'
export const CURRENCIES_STALE_MS = Number.POSITIVE_INFINITY
export const CURRENCIES_GC_MS = 1000 * 60 * 60 * 24
export const B2C_CURRENCIES_PATH = '/b2c_availabilityport/Country/currencies'
export const DEFAULT_CURRENCY = 'SYP'

/** Offline / API-failure list — matches the booking POS currencies in the reference UI. */
export const FALLBACK_CURRENCIES = [
  { currencyCode: 'SYP', currencyName: 'Syrian Pound' },
  { currencyCode: 'AED', currencyName: 'UAE Dirham' },
  { currencyCode: 'TRY', currencyName: 'Turkish Lira' },
  { currencyCode: 'SAR', currencyName: 'Saudi Arabia Riyal' },
  { currencyCode: 'KWD', currencyName: 'Kuwaiti Dinar' },
  { currencyCode: 'OMR', currencyName: 'Omani Rial' },
  { currencyCode: 'USD', currencyName: 'US Dollar' },
]

/** Currency code → flag file under `/images/flags/{cc}.svg`. */
const FLAG_BY_CURRENCY = {
  SYP: 'sy',
  AED: 'ae',
  TRY: 'tr',
  SAR: 'sa',
  KWD: 'kw',
  OMR: 'om',
  IQD: 'iq',
  AMD: 'am',
  LYD: 'ly',
  USD: 'us',
}

export function normalizeCurrencyCode(value) {
  const code = String(value ?? '').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(code) ? code : ''
}

export function currencyFlagSrc(currencyCode) {
  const code = normalizeCurrencyCode(currencyCode)
  const cc = FLAG_BY_CURRENCY[code] || 'sy'
  return `/images/flags/${cc}.svg`
}

export function currenciesQueryKey(languageCode = 'en') {
  return [CURRENCIES_QUERY_KEY, normalizeB2cLanguageCode(languageCode)]
}

/**
 * GET Country/currencies?language=en|ar
 * @returns {Promise<Array<{ currencyCode: string, currencyName: string }>>}
 */
export async function fetchCurrencies(languageCode = 'en') {
  const language = normalizeB2cLanguageCode(languageCode)
  const path = `${B2C_CURRENCIES_PATH}?language=${encodeURIComponent(language)}`
  const data = await fetchData(path)
  const list = Array.isArray(data?.result) ? data.result : Array.isArray(data) ? data : []
  return list
    .map((row) => ({
      currencyCode: normalizeCurrencyCode(row?.currencyCode || row?.code),
      currencyName: String(row?.currencyName || row?.name || '').trim(),
    }))
    .filter((row) => row.currencyCode)
}
