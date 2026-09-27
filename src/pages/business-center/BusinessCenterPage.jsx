import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Container from '../../shared/components/Container.jsx'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import usePage from '../../cms/hooks/usePage.js'
import PageBlocks from '../../cms/components/PageBlocks.jsx'

// Dynamic CMS page for slug `business-center` (URL `/business-center`).
// Blocks: breadcrumbs, page-media-hero, home-travel-experience (services cards),
// promo-banner (enquiry banner), business-quick-access (Figma 39658:121).
const PAGE_SLUG = 'business-center'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

const NewBusinessCenterContent = () => {
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
      {/* Figma rhythm: 60px between sections; ~21px breadcrumbs→hero, 37px hero→services.
          Home Travel Experience (3rd) carries its own py-8/md:py-10, so it and the
          block after it pull up by that padding. */}
      {page && (
        <PageBlocks
          blocks={page.blocks}
          lang={language}
          gapClass="gap-10 md:gap-[60px] [&>*:nth-child(2)]:-mt-5 md:[&>*:nth-child(2)]:-mt-[39px] [&>*:nth-child(3)]:-mt-10 md:[&>*:nth-child(3)]:-mt-[63px] [&>*:nth-child(4)]:-mt-8 md:[&>*:nth-child(4)]:-mt-10"
        />
      )}
    </main>
  )
}

const NewBusinessCenter = () => (
  <QueryClientProvider client={queryClient}>
    <NewBusinessCenterContent />
  </QueryClientProvider>
)

export default NewBusinessCenter
