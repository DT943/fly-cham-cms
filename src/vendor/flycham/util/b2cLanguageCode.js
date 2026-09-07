/**
 * B2C / B2B / OTA / Call Center payment APIs expect `LanguageCode` as a query param (`en` | `ar`).
 */
export function normalizeB2cLanguageCode(languageCode) {
  return String(languageCode || 'en').toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

/** Append `LanguageCode` to a relative API path (handles existing query string). */
export function withB2cLanguageCode(path, languageCode) {
  const lang = normalizeB2cLanguageCode(languageCode);
  const joiner = String(path || '').includes('?') ? '&' : '?';
  return `${path}${joiner}LanguageCode=${encodeURIComponent(lang)}`;
}

/**
 * Resolve `en` | `ar` for payment proxies from body and/or page-scoped URL
 * (`/{pos}/{lang}/…/create|validate`).
 * @param {Request} request
 * @param {Record<string, unknown>} [body]
 */
export function resolveLanguageCodeFromRequest(request, body = {}) {
  const fromBody = body?.languageCode ?? body?.LanguageCode ?? body?.lang;
  if (fromBody != null && String(fromBody).trim()) {
    return normalizeB2cLanguageCode(fromBody);
  }
  try {
    const pathname = new URL(request.url).pathname;
    const parts = pathname.split('/').filter(Boolean);
    // /{pos}/{lang}/b2b|ota|callcenter/epayments/...
    if (parts.length >= 2) {
      return normalizeB2cLanguageCode(parts[1]);
    }
  } catch {
    // ignore
  }
  return 'en';
}
