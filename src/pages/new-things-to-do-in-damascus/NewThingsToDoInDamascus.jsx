import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page, same pattern as new-flights-to-damascus — it renders whatever
// components the CMS holds for this slug in the URL's language.
const PAGE_SLUG = 'things-to-do-in-damascus'

// This page owns its own react-query cache (same pattern as NewFlightsToDamascus).
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewThingsToDoInDamascusContent = () => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()
  const { data: page, isLoading, isError, error } = usePage(PAGE_SLUG, language)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.whereWeFly'), href: '/our-destinations' },
    { label: t('flightsToDamascus.breadcrumb') },
  ]

  return (
    <main className="bg-100 w-full">
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

const NewThingsToDoInDamascus = () => (
  <QueryClientProvider client={queryClient}>
    <NewThingsToDoInDamascusContent />
  </QueryClientProvider>
)

export default NewThingsToDoInDamascus
