import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `home` (URL `/`).
// Blocks: page-media-hero, booking-widget, home-plan-trip, home-extra-services,
// home-travel-experience, home-cham-miles-banner, home-about, newsletter-signup.
const PAGE_SLUG = 'home'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewHomeContent = () => {
  const language = useCurrentLanguage()
  const { data: page, isLoading, isError, error } = usePage(PAGE_SLUG, language)

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-100">
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
      {/* The page ends in the full-width newsletter band → flush with the footer. */}
      {page && <PageBlocks blocks={page.blocks} lang={language} flushBottom />}
    </main>
  )
}

const NewHome = () => (
  <QueryClientProvider client={queryClient}>
    <NewHomeContent />
  </QueryClientProvider>
)

export default NewHome
