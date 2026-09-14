import { useQuery } from '@tanstack/react-query'
import { getPage } from '../api/getPage.js'

export const pageQueryKey = (slug) => ['cms-page', slug]

/**
 * React-Query hook that loads a CMS page by slug and caches it.
 * Consumers read `data.blocks` and render them through the section registry.
 */
export default function usePage(slug) {
  return useQuery({
    queryKey: pageQueryKey(slug),
    queryFn: () => getPage(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60_000,
  })
}
