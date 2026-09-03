export const SEARCH_HIT_PREFIX = 'search-hit-'

export function searchHitId(id) {
  return `${SEARCH_HIT_PREFIX}${id}`
}

export function getSearchHitElementId(hash = '') {
  const value = String(hash).replace(/^#/, '')
  return value.startsWith(SEARCH_HIT_PREFIX) ? value : ''
}

export function buildSearchHitHref(hit) {
  const hash = `#${hit.targetId}`
  if (!hit.questionId) return `${hit.href}${hash}`
  return `${hit.href}?question=${encodeURIComponent(hit.questionId)}${hash}`
}

export function getSearchHitKey(hash = '') {
  const id = getSearchHitElementId(hash)
  return id ? id.slice(SEARCH_HIT_PREFIX.length) : ''
}

export function scrollToSearchHit(id, { attempts = 16, delay = 80 } = {}) {
  if (!id || typeof document === 'undefined') return

  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('search-hit-flash')
    window.setTimeout(() => {
      el.classList.remove('search-hit-flash')
    }, 1600)
    return
  }

  if (attempts < 1) return
  window.setTimeout(() => scrollToSearchHit(id, { attempts: attempts - 1, delay }), delay)
}
