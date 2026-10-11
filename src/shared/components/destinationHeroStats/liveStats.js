// Live quick stats for the destination pages (flights-to-<city>, things-to-do-in-<city>).
//
// The destination comes from the page URL. Airport and currency are fixed
// facts from the table below; local time and its UTC offset are computed in
// the browser from the city's IANA time zone; the weather is fetched live from
// Open-Meteo (free, no API key, CORS-enabled).
//
// flychamadmin has the same logic (src/cms2/cmsComponents/DestinationHeroStats/
// utils/liveStats.js) — keep the two in sync.

export const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'

export const DESTINATIONS = {
  'abu-dhabi': { name: { en: 'Abu Dhabi', ar: 'أبو ظبي' }, lat: 24.4539, lon: 54.3773, timeZone: 'Asia/Dubai', airport: { code: 'AUH', en: 'Zayed International Airport', ar: 'مطار زايد الدولي' }, currency: { code: 'AED', en: 'UAE Dirham', ar: 'الدرهم الإماراتي' } },
  aleppo: { name: { en: 'Aleppo', ar: 'حلب' }, lat: 36.2021, lon: 37.1343, timeZone: 'Asia/Damascus', airport: { code: 'ALP', en: 'Aleppo International Airport', ar: 'مطار حلب الدولي' }, currency: { code: 'SYP', en: 'Syrian Pound', ar: 'الليرة السورية' } },
  baghdad: { name: { en: 'Baghdad', ar: 'بغداد' }, lat: 33.3152, lon: 44.3661, timeZone: 'Asia/Baghdad', airport: { code: 'BGW', en: 'Baghdad International Airport', ar: 'مطار بغداد الدولي' }, currency: { code: 'IQD', en: 'Iraqi Dinar', ar: 'الدينار العراقي' } },
  damascus: { name: { en: 'Damascus', ar: 'دمشق' }, lat: 33.5138, lon: 36.2765, timeZone: 'Asia/Damascus', airport: { code: 'DAM', en: 'Damascus International Airport', ar: 'مطار دمشق الدولي' }, currency: { code: 'SYP', en: 'Syrian Pound', ar: 'الليرة السورية' } },
  dammam: { name: { en: 'Dammam', ar: 'الدمام' }, lat: 26.4207, lon: 50.0888, timeZone: 'Asia/Riyadh', airport: { code: 'DMM', en: 'King Fahd International Airport', ar: 'مطار الملك فهد الدولي' }, currency: { code: 'SAR', en: 'Saudi Riyal', ar: 'الريال السعودي' } },
  dubai: { name: { en: 'Dubai', ar: 'دبي' }, lat: 25.2048, lon: 55.2708, timeZone: 'Asia/Dubai', airport: { code: 'DXB / DWC', en: 'Dubai International · Al Maktoum International', ar: 'مطار دبي الدولي · مطار آل مكتوم الدولي' }, currency: { code: 'AED', en: 'UAE Dirham', ar: 'الدرهم الإماراتي' } },
  erbil: { name: { en: 'Erbil', ar: 'أربيل' }, lat: 36.1912, lon: 44.0092, timeZone: 'Asia/Baghdad', airport: { code: 'EBL', en: 'Erbil International Airport', ar: 'مطار أربيل الدولي' }, currency: { code: 'IQD', en: 'Iraqi Dinar', ar: 'الدينار العراقي' } },
  istanbul: { name: { en: 'Istanbul', ar: 'إسطنبول' }, lat: 41.0082, lon: 28.9784, timeZone: 'Europe/Istanbul', airport: { code: 'SAW', en: 'Sabiha Gokcen International Airport', ar: 'مطار صبيحة كوكجن الدولي' }, currency: { code: 'TRY', en: 'Turkish Lira', ar: 'الليرة التركية' } },
  kuwait: { name: { en: 'Kuwait', ar: 'الكويت' }, lat: 29.3759, lon: 47.9774, timeZone: 'Asia/Kuwait', airport: { code: 'KWI', en: 'Kuwait International Airport', ar: 'مطار الكويت الدولي' }, currency: { code: 'KWD', en: 'Kuwaiti Dinar', ar: 'الدينار الكويتي' } },
  muscat: { name: { en: 'Muscat', ar: 'مسقط' }, lat: 23.588, lon: 58.3829, timeZone: 'Asia/Muscat', airport: { code: 'MCT', en: 'Muscat International Airport', ar: 'مطار مسقط الدولي' }, currency: { code: 'OMR', en: 'Omani Rial', ar: 'الريال العماني' } },
  sharjah: { name: { en: 'Sharjah', ar: 'الشارقة' }, lat: 25.3463, lon: 55.4209, timeZone: 'Asia/Dubai', airport: { code: 'SHJ', en: 'Sharjah International Airport', ar: 'مطار الشارقة الدولي' }, currency: { code: 'AED', en: 'UAE Dirham', ar: 'الدرهم الإماراتي' } },
  tripoli: { name: { en: 'Tripoli', ar: 'طرابلس' }, lat: 32.8872, lon: 13.1913, timeZone: 'Africa/Tripoli', airport: { code: 'MJI', en: 'Mitiga International Airport', ar: 'مطار معيتيقة الدولي' }, currency: { code: 'LYD', en: 'Libyan Dinar', ar: 'الدينار الليبي' } },
  yerevan: { name: { en: 'Yerevan', ar: 'يريفان' }, lat: 40.1792, lon: 44.4991, timeZone: 'Asia/Yerevan', airport: { code: 'EVN', en: 'Zvartnots International Airport', ar: 'مطار زفارتنوتس الدولي' }, currency: { code: 'AMD', en: 'Armenian Dram', ar: 'الدرام الأرمني' } },
}

const LABELS = {
  en: { airport: 'Airport', weather: 'Weather', localTime: 'Local time', currency: 'Currency', loading: 'Loading…', unavailable: 'Unavailable' },
  ar: { airport: 'المطار', weather: 'الطقس', localTime: 'الوقت المحلي', currency: 'العملة', loading: 'جارٍ التحميل…', unavailable: 'غير متاح' },
}

/** Page slug (or path) → destination entry, or null when it isn't a known destination page. */
export function destinationFromSlug(slugOrPath) {
  const slug = String(slugOrPath || '').split('/').filter(Boolean).pop() || ''
  const match = slug.replace(/^new-/, '').match(/^(?:flights-to|things-to-do-in)-(.+)$/)
  const key = match?.[1]
  return key && DESTINATIONS[key] ? { key, ...DESTINATIONS[key] } : null
}

// WMO weather code → day/night labels and Phosphor icon names.
const WEATHER_CODES = [
  [[0], { en: ['Sunny', 'Clear'], ar: ['مشمس', 'صافٍ'] }, ['Sun', 'Moon']],
  [[1], { en: ['Mostly sunny', 'Mostly clear'], ar: ['مشمس غالباً', 'صافٍ غالباً'] }, ['Sun', 'Moon']],
  [[2], { en: ['Partly cloudy', 'Partly cloudy'], ar: ['غائم جزئياً', 'غائم جزئياً'] }, ['CloudSun', 'CloudMoon']],
  [[3], { en: ['Cloudy', 'Cloudy'], ar: ['غائم', 'غائم'] }, ['Cloud', 'Cloud']],
  [[45, 48], { en: ['Fog', 'Fog'], ar: ['ضباب', 'ضباب'] }, ['CloudFog', 'CloudFog']],
  [[51, 53, 55], { en: ['Drizzle', 'Drizzle'], ar: ['رذاذ', 'رذاذ'] }, ['CloudRain', 'CloudRain']],
  [[56, 57, 66, 67], { en: ['Freezing rain', 'Freezing rain'], ar: ['أمطار متجمدة', 'أمطار متجمدة'] }, ['CloudRain', 'CloudRain']],
  [[61, 63, 80, 81], { en: ['Rain', 'Rain'], ar: ['ماطر', 'ماطر'] }, ['CloudRain', 'CloudRain']],
  [[65, 82], { en: ['Heavy rain', 'Heavy rain'], ar: ['أمطار غزيرة', 'أمطار غزيرة'] }, ['CloudRain', 'CloudRain']],
  [[71, 73, 75, 77, 85, 86], { en: ['Snow', 'Snow'], ar: ['ثلوج', 'ثلوج'] }, ['CloudSnow', 'CloudSnow']],
  [[95, 96, 99], { en: ['Thunderstorm', 'Thunderstorm'], ar: ['عواصف رعدية', 'عواصف رعدية'] }, ['CloudLightning', 'CloudLightning']],
]

function describeWeather(code, isDay, lang) {
  const row = WEATHER_CODES.find(([codes]) => codes.includes(code))
  if (!row) return { label: '', icon: 'cloudSun' }
  const index = isDay ? 0 : 1
  return { label: (row[1][lang] || row[1].en)[index], icon: row[2][index] }
}

const TTL_MS = 15 * 60 * 1000
const weatherCache = new Map()

/** Current weather for a destination (cached for 15 minutes per city). */
export function fetchDestinationWeather(destination) {
  const hit = weatherCache.get(destination.key)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.promise
  const params = new URLSearchParams({
    latitude: String(destination.lat),
    longitude: String(destination.lon),
    current: 'temperature_2m,weather_code,is_day',
    timezone: destination.timeZone,
  })
  const promise = fetch(`${WEATHER_API_URL}?${params}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Weather request failed (${res.status})`)
      return res.json()
    })
    .then((json) => ({
      temperature: Math.round(json?.current?.temperature_2m),
      code: Number(json?.current?.weather_code),
      isDay: json?.current?.is_day !== 0,
      date: String(json?.current?.time || '').slice(0, 10),
    }))
  weatherCache.set(destination.key, { at: Date.now(), promise })
  promise.catch(() => weatherCache.delete(destination.key))
  return promise
}

function utcOffsetLabel(timeZone, now) {
  try {
    const part = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value
    if (part) return part === 'GMT' ? 'UTC+0' : part.replace('GMT', 'UTC')
  } catch {
    // Older browsers without shortOffset: fall through.
  }
  return ''
}

function localTimeLabel(timeZone, now) {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(now)
  } catch {
    return ''
  }
}

/**
 * The four stats for a destination. `weather` is the fetch result, null while
 * loading, or { error: true } when the request failed.
 */
export function buildLiveStats(destination, lang = 'en', weather = null, now = new Date()) {
  const L = LABELS[lang] || LABELS.en
  const pick = (entry) => entry[lang] || entry.en
  let weatherStat
  if (weather && !weather.error && Number.isFinite(weather.temperature)) {
    const { label, icon } = describeWeather(weather.code, weather.isDay, lang)
    weatherStat = {
      icon,
      label: L.weather,
      value: `${weather.temperature}${lang === 'ar' ? '°م' : '°C'}`,
      detail: [label, weather.date].filter(Boolean).join(' · '),
    }
  } else {
    weatherStat = { icon: 'cloudSun', label: L.weather, value: '—', detail: weather?.error ? L.unavailable : L.loading }
  }
  return [
    { icon: 'airTrafficControl', label: L.airport, value: destination.airport.code, detail: pick(destination.airport) },
    weatherStat,
    { icon: 'clock', label: L.localTime, value: localTimeLabel(destination.timeZone, now) || '—', detail: utcOffsetLabel(destination.timeZone, now) },
    { icon: 'money', label: L.currency, value: pick(destination.currency), detail: destination.currency.code },
  ]
}
