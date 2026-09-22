import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `our-fleet` (URL `/new-our-fleet`).
// Blocks: page-media-hero, fleet-explore, seat-journey × 2 (modern, comfort),
// media-cards.
const PAGE_SLUG = 'our-fleet'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewOurFleetContent = () => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()
  const { data: page, isLoading, isError, error } = usePage(PAGE_SLUG, language)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('ourFleet.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
      </Container>

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

const NewOurFleet = () => (
  <QueryClientProvider client={queryClient}>
    <NewOurFleetContent />
  </QueryClientProvider>
)

export default NewOurFleet
