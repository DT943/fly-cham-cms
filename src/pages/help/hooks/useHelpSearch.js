import { useState } from 'react'

function useHelpSearch() {
  const [query, setQuery] = useState('')

  function handleQueryChange(event) {
    setQuery(event.target.value)
  }

  return { query, handleQueryChange }
}

export default useHelpSearch
