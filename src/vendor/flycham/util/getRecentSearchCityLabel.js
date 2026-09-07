/**
 * City label for a recent-search chip, resolved from the live airport catalog
 * for the active UI language (stored cookie cities are English-only).
 */
export function getRecentSearchCityLabel(airportItems, airportId, languageCode, fallback = '') {
  if (!airportId) return fallback || '';
  const airport = (airportItems ?? []).find((a) => String(a?.id) === String(airportId));
  if (!airport) return fallback || '';

  const translations = Array.isArray(airport.airPortTranslations)
    ? airport.airPortTranslations
    : [];
  const lang = String(languageCode || 'en').trim().toLowerCase() || 'en';
  const row =
    translations.find((t) => String(t?.languageCode || '').toLowerCase() === lang) ||
    translations.find((t) => String(t?.languageCode || '').toLowerCase() === 'en') ||
    translations[0];

  return String(row?.city || airport.iataCode || fallback || '').trim();
}
