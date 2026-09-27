import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `cargo-service` (URL `/cargo-service`).
// Blocks: page-media-hero, cargo-shipment-types, cargo-info-cards, cta-banner, faqs, info-accordion.
const PAGE_SLUG = 'cargo-service'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewCargoServiceContent = () => {
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
      {/* Figma rhythm: 49px under the hero, 60px between sections, 28px FAQs → info accordion. */}
      {page && (
        <PageBlocks
          blocks={page.blocks}
          lang={language}
          gapClass="gap-8 md:gap-[60px] md:[&>*:nth-child(2)]:-mt-[11px] md:[&>*:last-child]:-mt-8"
        />
      )}
    </main>
  )
}

const NewCargoService = () => (
  <QueryClientProvider client={queryClient}>
    <NewCargoServiceContent />
  </QueryClientProvider>
)

export default NewCargoService
