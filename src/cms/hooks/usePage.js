import { useQuery } from '@tanstack/react-query'
import { getPage } from '../api/getPage.js'

export const pageQueryKey = (slug, lang) => ['cms-page', slug, lang ?? null]

/**
 * React-Query hook that loads a CMS page by slug and caches it. `lang` selects
 * which language's blocks to fetch and is part of the cache key, so switching
 * language refetches the right set.
 * Consumers read `data.blocks` and render them through the section registry.
 */
export default function usePage(slug, lang) {
  return useQuery({
    queryKey: pageQueryKey(slug, lang),
    queryFn: () => getPage(slug, lang),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  })
}
