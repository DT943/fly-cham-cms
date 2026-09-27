import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { stripLanguage } from '../../i18n/languages.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'
import NotFound from '../not-found/NotFound.jsx'
import { cmsSlugFromPath } from './cmsPagePath.js'

// Generic dynamic CMS page for root pages created from the admin
// (/cms2/pages → "Add new page"). The URL's single segment IS the CMS slug:
// `/summer-offers` (or `/ar/summer-offers`) → get-page?slug=summer-offers.
// Static routes always win (see getPage in shared/routing/utils/pages.js), so
// this only renders for slugs no hand-built page claims.

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      // A missing / unpublished page is a 404 — don't retry it.
      retry: (failureCount, error) => error?.response?.status !== 404 && failureCount < 1,
    },
  },
})

const CmsPageContent = () => {
  const { pathname } = useLocation()
  const slug = cmsSlugFromPath(stripLanguage(pathname))
  const language = useCurrentLanguage()
  const { data: page, isLoading, isError, error } = usePage(slug, language)

  // Unknown slug, draft page (anon can't read it), or a page with no components
  // in this language yet → it doesn't exist here.
  const notFound =
    !slug ||
    error?.response?.status === 404 ||
    (page && !(page.blocks?.length > 0))
  if (notFound) return <NotFound />

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      {(isLoading || isError) && (
        <Container className="pb-5 md:pb-10">
          {isLoading && <p className="text-700">Loading…</p>}
          {isError && (
            <p className="text-alert">
              Failed to load page{error?.message ? `: ${error.message}` : ''}.
            </p>
          )}
        </Container>
      )}
      {page && <PageBlocks blocks={page.blocks} lang={language} />}
    </main>
  )
}

const CmsPage = () => (
  <QueryClientProvider client={queryClient}>
    <CmsPageContent />
  </QueryClientProvider>
)

export default CmsPage
