import { useEffect, useId, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Container from '../../shared/components/Container.jsx'
import LegalMoreInfo from '../../shared/components/LegalMoreInfo.jsx'
import useAppSearch from '../../shared/search/hooks/useAppSearch.js'
import { typography } from '../../styles/typography.js'
import SearchField from '../help/components/SearchConsole/SearchField.jsx'

const HELP_CARDS = [
  { id: 'faqs', icon: 'question', href: '/help/faqs' },
  { id: 'contact', icon: 'phone', href: '/help/contact-us' },
]

/**
 * Site-wide search: the Help search field and its suggestion dropdown over the
 * whole app search index. `?q=` pre-fills the query.
 */
const SearchInSite = () => {
  const { t } = useTranslation()
  const inputId = useId()
  const containerRef = useRef(null)
  const [searchParams] = useSearchParams()
  const search = useAppSearch()
  const { applyQuery, closeMenu } = search

  const initialQuery = searchParams.get('q') || ''
  useEffect(() => {
    if (initialQuery) applyQuery(initialQuery)
    // Only pre-fill from the URL on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) closeMenu()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [closeMenu])

  const cards = HELP_CARDS.map(({ id, icon, href }) => ({
    id,
    icon,
    href,
    title: t(`searchInSite.help.${id}.title`),
    description: t(`searchInSite.help.${id}.description`),
    cta: t(`searchInSite.help.${id}.cta`),
  }))

  return (
    <main className="w-full bg-100">
      <Container className="pt-8 md:pt-12">
        <h1 className={`m-0 font-bold leading-tight text-primary-1 lg:text-[44px] ${typography.pageTitle}`}>
          {t('searchInSite.title')}
        </h1>
      </Container>

      <Container className="mt-6 md:mt-8">
        <div className="relative z-10 bg-primary-1 px-4 py-5 md:px-10 md:py-6">
          <SearchField
            inputId={inputId}
            containerRef={containerRef}
            query={search.query}
            results={search.results}
            isMenuOpen={search.isMenuOpen}
            language={search.language}
            placeholder={t('searchInSite.placeholder')}
            submitLabel={t('searchInSite.submit')}
            ariaLabel={t('searchInSite.title')}
            showSearchIcon
            showSuggestions
            inputBg="background"
            inputTextColor="700"
            submitBg="secondary"
            submitTextColor="700"
            submitFontWeight="semibold"
            onQueryChange={(_, event) => search.handleQueryChange(event)}
            onFocus={search.handleFocus}
            onSelect={search.handleSelect}
          />
        </div>
      </Container>

      <LegalMoreInfo title={t('searchInSite.help.title')} cards={cards} showSectionBg={false} />
    </main>
  )
}

export default SearchInSite
