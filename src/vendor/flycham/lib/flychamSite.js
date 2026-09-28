/**
 * Where the vendored booking box sends the traveller.
 *
 * This app is a separate marketing site — it has no search-results page of its
 * own — so the widget's `resultsPath` points at the booking engine on
 * flycham.com. Paths there are `/{pos}/{lang}/...`; `pos` is not part of this
 * app's URLs, so it comes from `VITE_FLYCHAM_POS` (flycham.com's own middleware
 * uses "gb" as the global default).
 */
import { useParams } from 'next/navigation';

export const FLYCHAM_SITE_URL = (
  import.meta.env.VITE_FLYCHAM_SITE_URL || 'http://flycham.com'
).replace(/\/+$/, '');

/** `/{pos}/{lang}` for the language the visitor is currently browsing in. */
export function useFlyChamLocalePrefix() {
  const { pos, lang } = useParams();
  return `/${pos || 'gb'}/${lang || 'en'}`;
}

/** Absolute URL of the flycham.com search-results page. */
export function useFlyChamSearchResultsUrl(cId) {
  const prefix = useFlyChamLocalePrefix();
  return cId
    ? `${FLYCHAM_SITE_URL}${prefix}/search-results/c/${cId}`
    : `${FLYCHAM_SITE_URL}${prefix}/search-results`;
}
