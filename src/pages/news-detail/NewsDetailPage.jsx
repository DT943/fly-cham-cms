import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { stripLanguage } from '../../i18n/languages.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

/**
 * Dynamic news article pages.
 * Frontend: `/media-center/news/fleetUpdate`
 * CMS slug: `news-fleet-update`
 */
const ARTICLE_PAGES = {
  '/media-center/news/fleetUpdate': {
    slug: 'news-fleet-update',
  },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewNewsDetailContent = () => {
  const language = useCurrentLanguage()
  const { pathname } = useLocation()
  const meta =
    ARTICLE_PAGES[stripLanguage(pathname)] ||
    ARTICLE_PAGES['/media-center/news/fleetUpdate']
  const { data: page, isLoading, isError, error } = usePage(meta.slug, language)

  return (
    <main className="bg-100 w-full overflow-x-clip pb-12 md:pb-16">
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

const NewNewsDetail = () => (
  <QueryClientProvider client={queryClient}>
    <NewNewsDetailContent />
  </QueryClientProvider>
)

export default NewNewsDetail
