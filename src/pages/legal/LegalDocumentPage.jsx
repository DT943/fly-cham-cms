import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { stripLanguage } from '../../i18n/languages.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

const PAGES = {
  '/legal/terms-and-conditions': {
    slug: 'terms-and-conditions',
  },
  '/legal/booking-terms-and-conditions': {
    slug: 'booking-terms-and-conditions',
  },
  '/legal/privacy-policy': {
    slug: 'privacy-policy',
  },
  '/legal/cookies': {
    slug: 'cookies',
  },
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewLegalDocumentContent = () => {
  const language = useCurrentLanguage()
  const { pathname } = useLocation()
  const meta = PAGES[stripLanguage(pathname)] || PAGES['/legal/terms-and-conditions']
  const { data: page, isLoading, isError, error } = usePage(meta.slug, language)

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

const NewLegalDocument = () => (
  <QueryClientProvider client={queryClient}>
    <NewLegalDocumentContent />
  </QueryClientProvider>
)

export default NewLegalDocument
