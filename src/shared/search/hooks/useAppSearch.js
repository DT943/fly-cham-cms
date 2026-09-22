import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { stripLanguage, withLanguage } from '../../../i18n/languages.js'
import useCurrentLanguage from '../../hooks/useCurrentLanguage.js'
import { newPages } from '../../routing/utils/newPages.js'
import { toNewPageHref } from '../../routing/utils/toNewPageHref.js'
import { searchAppContent } from '../utils/searchContent.js'
import { buildSearchHitHref, scrollToSearchHit } from '../utils/searchHit.js'

function useAppSearch({ types, href } = {}) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const language = useCurrentLanguage()
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const preferNewPages = Boolean(newPages[stripLanguage(pathname)])

  const results = searchAppContent(query, { types, href }).map((hit) =>
    preferNewPages ? { ...hit, href: toNewPageHref(hit.href) } : hit,
  )

  function handleQueryChange(event) {
    const value = event.target.value
    setQuery(value)
    setIsMenuOpen(value.trim().length > 0)
  }

  function handleFocus() {
    if (query.trim()) setIsMenuOpen(true)
  }

  function handleSelect(hit) {
    const label = hit.title?.[language] || hit.title?.en || ''
    setQuery(label)
    setIsMenuOpen(false)
    navigate(withLanguage(buildSearchHitHref(hit), language))
    window.setTimeout(() => scrollToSearchHit(hit.targetId), 80)
  }

  function applyQuery(label) {
    setQuery(label)
    setIsMenuOpen(label.trim().length > 0)
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return {
    query,
    results,
    isMenuOpen,
    language,
    handleQueryChange,
    handleFocus,
    handleSelect,
    applyQuery,
    closeMenu,
  }
}

export default useAppSearch
