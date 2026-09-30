import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Container from '../../shared/components/Container.jsx'
import PageSkeleton from '../../shared/components/PageSkeleton.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { stripLanguage } from '../../i18n/languages.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'
import NotFound from '../not-found/NotFound.jsx'
import { cmsSlugFromPath } from './cmsPagePath.js'

// The ONE page component for every CMS-driven route. It loads the CMS page for
// `slug` in the URL's language and renders its blocks through the section
// registry, with the shared loading / error / not-found states.
//
// - Official routes pass a fixed `slug` (+ layout options) — see
//   `dynamicPage()` in shared/routing/utils/newPages.js.
// - Without a `slug` it serves pages created in the admin ("Add new page"):
//   the URL's single segment IS the slug (`/summer-offers`).
// - The 404 page is itself a DynamicPage (slug `not-found`, see
//   pages/not-found/NotFound.jsx) with a built-in `fallback`, so a missing page
//   never loops back into another failing load.

// One cache for all CMS pages (this app has no global react-query provider),
// so revisiting a page is instant.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // A missing / unpublished page is a 404 — don't retry it.
      retry: (failureCount, error) => error?.response?.status !== 404 && failureCount < 1,
    },
  },
})

const DEFAULT_CLASS = 'bg-100 w-full pb-12 md:pb-16'
const DEFAULT_STATUS_CLASS = 'pb-5 md:pb-10'

const DynamicPageContent = ({
  slug: fixedSlug,
  className = DEFAULT_CLASS,
  statusClassName = DEFAULT_STATUS_CLASS,
  gapClass,
  flushBottom = false,
  blocksClassName,
  fallback,
}) => {
  const { pathname } = useLocation()
  const language = useCurrentLanguage()
  const slug = fixedSlug || cmsSlugFromPath(stripLanguage(pathname))
  const { data: page, isLoading, isError, error } = usePage(slug, language)
  const hasBlocks = page?.blocks?.length > 0

  // `fallback`: what to show whenever the page can't be displayed (missing,
  // failed, or no blocks) — used by the 404 page, which must never fail.
  if (fallback && (!slug || isError || (page && !hasBlocks))) return fallback

  // Unknown slug or draft page (anon can't read it) → not found. An admin-created
  // page also counts as missing in a language where it has no components yet.
  const notFound =
    !slug || error?.response?.status === 404 || (!fixedSlug && page && !hasBlocks)
  if (notFound) return <NotFound />

  return (
    <main
      className={
        isLoading ? 'flex min-h-dvh w-full flex-1 flex-col bg-100' : className
      }
    >
      {isLoading && <PageSkeleton />}
      {isError && (
        <Container className={statusClassName}>
          <p className="text-alert">
            Failed to load page{error?.message ? `: ${error.message}` : ''}.
          </p>
        </Container>
      )}
      {page && (
        <PageBlocks
          blocks={page.blocks}
          lang={language}
          flushBottom={flushBottom}
          {...(gapClass ? { gapClass } : {})}
          {...(blocksClassName ? { className: blocksClassName } : {})}
        />
      )}
    </main>
  )
}

const DynamicPage = (props) => (
  <QueryClientProvider client={queryClient}>
    <DynamicPageContent {...props} />
  </QueryClientProvider>
)

export default DynamicPage
