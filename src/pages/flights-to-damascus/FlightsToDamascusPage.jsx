import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page, same pattern as new-our-destinations — it renders whatever
// components the CMS holds for this slug in the URL's language.
const PAGE_SLUG = 'flights-to-damascus'

// This page owns its own react-query cache (same pattern as NewOurDestinations).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewFlightsToDamascusContent = () => {
  const language = useCurrentLanguage()
  const { data: page, isLoading, isError, error } = usePage(PAGE_SLUG, language)

  return (
    <main className="w-full bg-background lg:bg-100">
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

const NewFlightsToDamascus = () => (
  <QueryClientProvider client={queryClient}>
    <NewFlightsToDamascusContent />
  </QueryClientProvider>
)

export default NewFlightsToDamascus
