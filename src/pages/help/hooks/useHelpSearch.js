import { useCallback, useState } from 'react'
import { searchSuggestions, filterSearchSuggestions } from '../utils/searchSuggestions.js'

function useHelpSearch() {
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const suggestions = filterSearchSuggestions(searchSuggestions, query)

  function handleQueryChange(event) {
    const value = event.target.value
    setQuery(value)
    setIsMenuOpen(value.trim().length > 0)
  }

  function handleFocus() {
    if (query.trim()) setIsMenuOpen(true)
  }

  function handleSelect(label) {
    setQuery(label)
    setIsMenuOpen(false)
  }

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  return {
    query,
    suggestions,
    isMenuOpen,
    handleQueryChange,
    handleFocus,
    handleSelect,
    closeMenu,
  }
}

export default useHelpSearch
