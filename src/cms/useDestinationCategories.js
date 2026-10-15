import { useEffect, useState } from 'react'
import cmsClient from './api/cmsClient.js'

let cached = null
let pending = null

function loadCategories() {
  if (cached) return Promise.resolve(cached)
  if (!pending) {
    pending = cmsClient
      .get('/api/public/destination-categories', { params: { _: Date.now() }, timeout: 10000 })
      .then(({ data }) => {
        cached = Array.isArray(data?.data) ? data.data : []
        return cached
      })
      .catch(() => {
        pending = null
        return null
      })
  }
  return pending
}

/** Shared destination categories. `status` is loading, ready, or error. */
export default function useDestinationCategories(lang = 'en') {
  const [state, setState] = useState(() =>
    cached ? { status: 'ready', rows: cached } : { status: 'loading', rows: [] },
  )

  useEffect(() => {
    let cancel = false
    loadCategories().then((rows) => {
      if (cancel) return
      if (!rows) setState({ status: 'error', rows: [] })
      else setState({ status: 'ready', rows })
    })
    return () => {
      cancel = true
    }
  }, [])

  const arabic = String(lang).toLowerCase() === 'ar'
  const categories = state.rows.map((row) => ({
    id: row.slug,
    icon: row.icon || 'landmarks',
    label: arabic ? row.labelAr : row.labelEn,
  }))
  return { categories, status: state.status }
}
