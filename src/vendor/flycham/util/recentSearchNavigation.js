import { encodeSearchToken } from '@/util/searchToken';

export function getLocalePrefix(pathname) {
  const segments = (pathname || '').split('/').filter(Boolean);
  const [pos, langSeg] = segments;
  return pos && langSeg ? `/${pos}/${langSeg}` : '';
}

/**
 * Build the search-results URL for a recent-search payload.
 *
 * @param {string} pathname Current pathname (used to extract pos/lang).
 * @param {object} data     Recent-search payload to re-run.
 */
export function buildSearchResultsHref(pathname, data) {
  const localePrefix = getLocalePrefix(pathname);
  const token = encodeSearchToken(data);
  return token
    ? `${localePrefix}/search-results?token=${token}`
    : `${localePrefix}/search-results`;
}
