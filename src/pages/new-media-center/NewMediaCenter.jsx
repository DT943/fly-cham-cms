import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `media-center` (URL `/new-media-center`).
// Blocks: page-media-hero, page-intro, latest-news, news-grid,
// magazine-banner, media-contact-cards, media-newsletter-signup (fullBleed).
const PAGE_SLUG = 'media-center'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewMediaCenterContent = () => {
  const language = useCurrentLanguage()
  const { data: page, isLoading, isError, error } = usePage(PAGE_SLUG, language)

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

const NewMediaCenter = () => (
  <QueryClientProvider client={queryClient}>
    <NewMediaCenterContent />
  </QueryClientProvider>
)

export default NewMediaCenter
