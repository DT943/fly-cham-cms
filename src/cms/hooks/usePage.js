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
    // Admin saves must show on the next visit. The app-wide client turns
    // window-focus refetch off, so this query opts back in.
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })
}
