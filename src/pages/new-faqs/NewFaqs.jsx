import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `faqs` (URL `/help/faqs`).
// Blocks: page-hero, search-console, help-faqs, get-help, live-chat-banner.
const PAGE_SLUG = 'faqs'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewFaqsContent = () => {
  const language = useCurrentLanguage()
  const { data: page, isLoading, isError, error } = usePage(PAGE_SLUG, language)

  return (
    <main className="bg-100 w-full">
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

const NewFaqs = () => (
  <QueryClientProvider client={queryClient}>
    <NewFaqsContent />
  </QueryClientProvider>
)

export default NewFaqs
