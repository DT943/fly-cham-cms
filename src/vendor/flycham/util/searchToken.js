const DEFAULT_SECRET = 'flycham-search-token';
const MAX_TOKEN_LENGTH = 12;

const getSecret = () =>
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SEARCH_TOKEN_SECRET) ||
  DEFAULT_SECRET;

// Base64URL encoding (URL-safe, no padding)
const base64urlEncode = (str) => {
  if (typeof btoa === 'undefined') {
    // Node.js environment
    return Buffer.from(str, 'binary').toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const base64urlDecode = (str) => {
  // Add padding if needed
  let padded = str.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4) {
    padded += '=';
  }
  if (typeof atob === 'undefined') {
    // Node.js environment
    return Buffer.from(padded, 'base64').toString('binary');
  }
  return atob(padded);
};

// Convert number to base36 (0-9, a-z) for more compact representation
const toBase36 = (num) => {
  if (num === 0) return '0';
  let result = '';
  let n = Math.abs(num);
  while (n > 0) {
    result = (n % 36).toString(36) + result;
    n = Math.floor(n / 36);
  }
  return num < 0 ? '-' + result : result;
};

const fromBase36 = (str) => {
  const isNegative = str[0] === '-';
  const num = parseInt(str.replace('-', ''), 36);
  return isNegative ? -num : num;
};

// Convert date "2024-01-15T00:00:00" to days since 2020-01-01 (more compact, smaller numbers)
const EPOCH_DATE = Date.UTC(2020, 0, 1);
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const dateToDays = (dateStr) => {
  if (!dateStr) return 0;
  const dateOnly = dateStr.replace(/T.*$/, '');
  const [year, month, day] = dateOnly.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const daysSinceEpoch = Math.floor((date.getTime() - EPOCH_DATE) / MS_PER_DAY);
  return Math.max(0, daysSinceEpoch); // Ensure non-negative
};

const daysToDate = (days) => {
  if (!days || days === 0) return null;
  const date = new Date(EPOCH_DATE + days * MS_PER_DAY);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00`;
};

const MC_LEGS_MARKER = 'L';
/** Trailer marker: `|C|USD` — currency lives in the compact token, not a separate query param. */
const CURRENCY_MARKER = 'C';

const isMultiCityFlighttype = (flighttype) => {
  const v = String(flighttype ?? '').trim();
  return v === 'MultiCity' || v === 'MC' || v.toLowerCase() === 'multicity';
};

const normalizeCurrencyCode = (value) => {
  const code = String(value ?? '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : '';
};

function appendCurrencyPart(parts, payload) {
  const code = normalizeCurrencyCode(payload.currency);
  if (!code) return;
  parts.push('|');
  parts.push(CURRENCY_MARKER);
  parts.push('|');
  parts.push(code);
}

/** Pull `|C|XXX` trailer (usually at end) so legacy pos/MC parsers stay unchanged. */
function extractCurrencyTrailer(parts) {
  for (let i = parts.length - 2; i >= 5; i -= 1) {
    if (parts[i] !== CURRENCY_MARKER) continue;
    const code = normalizeCurrencyCode(parts[i + 1]);
    if (!code) continue;
    return {
      currency: code,
      parts: parts.slice(0, i).concat(parts.slice(i + 2)),
    };
  }
  return { currency: '', parts };
}

/** Normalize legs for token encode (array of { origin_id, destination_id, date }). */
function normalizeLegsForToken(raw) {
  let legs = raw;
  if (typeof legs === 'string') {
    try {
      legs = JSON.parse(legs);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(legs)) return [];
  return legs
    .map((leg) => {
      const dateStr = String(leg?.date ?? '').trim();
      const dateOnly = dateStr.slice(0, 10);
      if (!leg?.origin_id || !leg?.destination_id || !dateOnly) return null;
      return {
        origin_id: Number(leg.origin_id),
        destination_id: Number(leg.destination_id),
        date: dateStr.includes('T') ? dateStr : `${dateOnly}T00:00:00`,
      };
    })
    .filter(Boolean);
}

function appendPosDisplayParts(parts, payload) {
  const displayOriginRaw = payload.display_origin_id;
  const displayDestRaw = payload.display_destination_id;
  const hasDisplayUi =
    (displayOriginRaw != null &&
      displayOriginRaw !== '' &&
      Number(displayOriginRaw) !== 0) ||
    (displayDestRaw != null &&
      displayDestRaw !== '' &&
      Number(displayDestRaw) !== 0);

  if (hasDisplayUi) {
    parts.push('|');
    parts.push(toBase36(Number(payload.pos_id) || 0));
    parts.push('|');
    parts.push(toBase36(Number(displayOriginRaw) || 0));
    parts.push('|');
    parts.push(toBase36(Number(displayDestRaw) || 0));
  } else if (payload.pos_id !== undefined && payload.pos_id !== 0) {
    parts.push('|');
    parts.push(toBase36(payload.pos_id));
  }
}

function appendMcLegsTrailer(parts, legs) {
  if (!legs.length) return;
  parts.push('|');
  parts.push(MC_LEGS_MARKER);
  parts.push('|');
  parts.push(toBase36(legs.length));
  legs.forEach((leg) => {
    parts.push('|');
    parts.push(toBase36(leg.origin_id || 0));
    parts.push('|');
    parts.push(toBase36(leg.destination_id || 0));
    parts.push('|');
    parts.push(toBase36(dateToDays(leg.date)));
  });
}

function parsePosDisplayBeforeMc(parts, lIndex, payload) {
  if (lIndex <= 5) {
    payload.pos_id = 0;
    return;
  }
  if (lIndex === 8) {
    payload.pos_id = fromBase36(parts[5] || '0');
    const dO = fromBase36(parts[6] || '0');
    const dD = fromBase36(parts[7] || '0');
    if (dO) payload.display_origin_id = dO;
    if (dD) payload.display_destination_id = dD;
    return;
  }
  if (lIndex === 6) {
    payload.pos_id = fromBase36(parts[5] || '0');
    return;
  }
  payload.pos_id = 0;
}

function parseMcLegsTrailer(parts, lIndex, payload) {
  const legCount = fromBase36(parts[lIndex + 1] || '0');
  if (!legCount || legCount < 2) return;
  const legs = [];
  let idx = lIndex + 2;
  for (let i = 0; i < legCount; i += 1) {
    if (idx + 2 >= parts.length) break;
    const origin_id = fromBase36(parts[idx++] || '0');
    const destination_id = fromBase36(parts[idx++] || '0');
    const days = fromBase36(parts[idx++] || '0');
    const date = daysToDate(days);
    if (origin_id && destination_id && date) {
      legs.push({ origin_id, destination_id, date });
    }
  }
  if (legs.length >= 2) {
    payload.legs = legs;
  }
}

// Ultra-compact serialization: pack into minimal string without separators
// Format: oo.dd.dt.dr.gf (origin, dest, date, date_return, guests+flags)
// Multi-city: flags bit 3 + trailer |L|count|o|d|days|...
function compactSerialize(payload) {
  const parts = [];
  
  // Origin and destination (base36, typically 1-3 chars each)
  parts.push(toBase36(payload.origin_id || 0));
  parts.push('|'); // Use pipe as separator (single char)
  parts.push(toBase36(payload.destination_id || 0));
  parts.push('|');
  
  // Dates as days since epoch (base36, typically 3-4 chars)
  const dateDays = payload.date ? dateToDays(payload.date) : 0;
  parts.push(toBase36(dateDays));
  parts.push('|');
  
  const returnDays = payload.date_return ? dateToDays(payload.date_return) : 0;
  parts.push(toBase36(returnDays));
  parts.push('|');
  
  // Pack guests and flags compactly
  const adults = payload.adults ?? 1;
  const children = payload.children ?? 0;
  const infants = payload.infants ?? 0;
  const infantswithseat = Number(payload.infantswithseat ?? 0) || 0;
  const flightclass = payload.flightclass === 'C' ? 1 : 0;
  const isMc = isMultiCityFlighttype(payload.flighttype);
  const flighttypeReturn = !isMc && payload.flighttype === 'Return' ? 1 : 0;
  const neirby = payload.neirby || payload.nearby ? 1 : 0;
  const multiCity = isMc ? 1 : 0;

  // flags: bit0=business, bit1=return, bit2=neirby, bit3=multicity
  const flags = (flightclass << 0) | (flighttypeReturn << 1) | (neirby << 2) | (multiCity << 3);
  
  // Format: aacisf (adults, children, infants, infantswithseat, flags)
  parts.push(toBase36(adults));
  parts.push(toBase36(children));
  parts.push(toBase36(infants));
  parts.push(toBase36(infantswithseat));
  parts.push(toBase36(flags));

  appendPosDisplayParts(parts, payload);

  if (isMc) {
    const legs = normalizeLegsForToken(payload.legs);
    appendMcLegsTrailer(parts, legs);
  }

  appendCurrencyPart(parts, payload);

  return parts.join('');
}

function compactDeserialize(str) {
  const payload = {};
  const extracted = extractCurrencyTrailer(str.split('|'));
  const parts = extracted.parts;
  if (extracted.currency) payload.currency = extracted.currency;

  if (parts.length < 5) return payload;
  
  // Parse origin and destination
  payload.origin_id = fromBase36(parts[0] || '0');
  payload.destination_id = fromBase36(parts[1] || '0');
  
  // Parse dates
  const dateDays = fromBase36(parts[2] || '0');
  if (dateDays) payload.date = daysToDate(dateDays);
  
  const returnDays = fromBase36(parts[3] || '0');
  if (returnDays) payload.date_return = daysToDate(returnDays);
  
  // Parse guests and flags (new: aacisf; legacy: aacif)
  const guestPart = parts[4] || '';
  if (guestPart.length >= 4) {
    payload.adults = fromBase36(guestPart[0] || '1') || 1;
    payload.children = fromBase36(guestPart[1] || '0') || 0;
    payload.infants = fromBase36(guestPart[2] || '0') || 0;

    const hasInfantsWithSeatChar = guestPart.length >= 5;
    const flagsIndex = hasInfantsWithSeatChar ? 4 : 3;
    if (hasInfantsWithSeatChar) {
      payload.infantswithseat = fromBase36(guestPart[3] || '0') || 0;
    } else {
      payload.infantswithseat = 0;
    }

    const flags = fromBase36(guestPart[flagsIndex] || '0');
    payload.flightclass = (flags & 1) ? 'C' : 'Y';
    if (flags & 8) {
      payload.flighttype = 'MultiCity';
    } else {
      payload.flighttype = (flags & 2) ? 'Return' : 'OneWay';
    }
    payload.neirby = !!(flags & 4);
  } else {
    // Defaults
    payload.adults = 1;
    payload.children = 0;
    payload.infants = 0;
    payload.flightclass = 'Y';
    payload.flighttype = 'OneWay';
    payload.neirby = false;
  }

  const lIndex = parts.indexOf(MC_LEGS_MARKER);
  if (lIndex >= 0) {
    parsePosDisplayBeforeMc(parts, lIndex, payload);
    parseMcLegsTrailer(parts, lIndex, payload);
    return payload;
  }

  // Extended trailer: |pos|display_origin|display_destination| (8 parts)
  if (parts.length >= 8) {
    payload.pos_id = fromBase36(parts[5] || '0');
    const dO = fromBase36(parts[6] || '0');
    const dD = fromBase36(parts[7] || '0');
    if (dO) payload.display_origin_id = dO;
    if (dD) payload.display_destination_id = dD;
  } else if (parts.length === 6) {
    payload.pos_id = fromBase36(parts[5] || '0');
  } else {
    payload.pos_id = 0;
  }

  return payload;
}

/** Prefer display_* from token; use query only for old bookmarks that still pass them in the URL. */
export function mergeTokenDecodeWithSearchParams(decoded, searchParams) {
  if (!decoded) return null;
  const sp = searchParams || {};
  const missingDo =
    decoded.display_origin_id == null ||
    decoded.display_origin_id === '' ||
    Number(decoded.display_origin_id) === 0;
  const missingDd =
    decoded.display_destination_id == null ||
    decoded.display_destination_id === '' ||
    Number(decoded.display_destination_id) === 0;
  return {
    ...decoded,
    ...(missingDo && sp.display_origin_id != null && sp.display_origin_id !== ''
      ? { display_origin_id: sp.display_origin_id }
      : {}),
    ...(missingDd && sp.display_destination_id != null && sp.display_destination_id !== ''
      ? { display_destination_id: sp.display_destination_id }
      : {}),
    ...((!decoded.legs || decoded.legs.length === 0) && sp.legs
      ? { legs: sp.legs }
      : {}),
    ...(sp.infantswithseat != null && sp.infantswithseat !== '' &&
    (decoded.infantswithseat == null || Number(decoded.infantswithseat) === 0)
      ? { infantswithseat: sp.infantswithseat }
      : {}),
    // Migrate legacy `?currency=OMR` into keyParams; next URL write folds it into the token only.
    ...(!normalizeCurrencyCode(decoded.currency) && normalizeCurrencyCode(sp.currency)
      ? { currency: normalizeCurrencyCode(sp.currency) }
      : {}),
  };
}

export function encodeSearchToken(payload = {}) {
  try {
    const secret = getSecret();
    const compact = compactSerialize(payload);
    
    // XOR encrypt
    let encrypted = '';
    for (let i = 0; i < compact.length; i += 1) {
      const charCode = compact.charCodeAt(i);
      const secretCode = secret.charCodeAt(i % secret.length);
      encrypted += String.fromCharCode(charCode ^ secretCode);
    }
    
    // Encode with base64url
    const token = base64urlEncode(encrypted);
    
    // Note: Token length depends on payload size. For typical search params,
    // this should be under 12 chars, but complex queries may exceed it.
    // If token is too long, consider further compression or a hash-based approach.
    if (token.length > MAX_TOKEN_LENGTH) {
      //console.warn(`Token length ${token.length} exceeds max ${MAX_TOKEN_LENGTH}. Consider reducing payload size.`);
    }
    
    return token;
  } catch (error) {
    console.error('encodeSearchToken failed', error);
    return '';
  }
}

export function decodeSearchToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const secret = getSecret();
    
    // Decode from base64url
    let encrypted;
    try {
      encrypted = base64urlDecode(token);
    } catch (e) {
      // If decoding fails, try treating as the full token (backward compatibility)
      encrypted = base64urlDecode(token.padEnd(Math.ceil(token.length / 4) * 4, '='));
    }
    
    // XOR decrypt
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i += 1) {
      const code = encrypted.charCodeAt(i);
      const secretCode = secret.charCodeAt(i % secret.length);
      decrypted += String.fromCharCode(code ^ secretCode);
    }
    
    // Deserialize compact format
    return compactDeserialize(decrypted);
  } catch (error) {
    console.error('decodeSearchToken failed', error);
    return null;
  }
}

