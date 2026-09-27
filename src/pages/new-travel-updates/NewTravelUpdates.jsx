import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `travel-updates` (URL `/travel-updates`).
// Blocks: page-media-hero, travel-updates-advisory, travel-updates-list.
const PAGE_SLUG = 'travel-updates'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewTravelUpdatesContent = () => {
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
      {/* Figma rhythm: 60px under the hero, 24px between the advisory and list cards. */}
      {page && (
        <PageBlocks
          blocks={page.blocks}
          lang={language}
          gapClass="gap-6 [&>*:nth-child(2)]:mt-3 md:[&>*:nth-child(2)]:mt-9"
        />
      )}
    </main>
  )
}

const NewTravelUpdates = () => (
  <QueryClientProvider client={queryClient}>
    <NewTravelUpdatesContent />
  </QueryClientProvider>
)

export default NewTravelUpdates
