import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `cargo-stations` (URL `/cargo-stations`).
// Blocks: cargo-stations-explorer, seat-journey (request row), promo-banner (cargo guide).
const PAGE_SLUG = 'cargo-stations'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewCargoStationsContent = () => {
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
      {/* Figma rhythm: 102px under the stations band, 56px above the cargo guide banner. */}
      {page && (
        <PageBlocks
          blocks={page.blocks}
          lang={language}
          gapClass="gap-8 md:gap-[56px] md:[&>*:nth-child(2)]:mt-[46px]"
        />
      )}
    </main>
  )
}

const NewCargoStations = () => (
  <QueryClientProvider client={queryClient}>
    <NewCargoStationsContent />
  </QueryClientProvider>
)

export default NewCargoStations
