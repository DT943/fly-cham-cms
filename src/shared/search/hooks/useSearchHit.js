import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSearchHitElementId, scrollToSearchHit } from '../utils/searchHit.js'

function useSearchHit() {
  const { hash, pathname, search } = useLocation()

  useEffect(() => {
    const id = getSearchHitElementId(hash)
    if (!id) return undefined

    const timer = window.setTimeout(() => scrollToSearchHit(id), 120)
    return () => window.clearTimeout(timer)
  }, [hash, pathname, search])
}

export default useSearchHit
