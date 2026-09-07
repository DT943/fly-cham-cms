/**
 * `next/navigation` shim for the vendored Fly Cham booking box.
 *
 * The booking box is copied verbatim from the Next.js app (`flychamwebsite`), so it
 * still imports `next/navigation`. Vite aliases that specifier to this file, which
 * re-implements the four hooks the widget uses on top of react-router-dom.
 *
 * Route shape differs between the two apps:
 *   flychamwebsite  /{pos}/{lang}/...      → useParams() = { pos, lang }
 *   new_fly_cham    /{lang}/...            → pos is not in the URL, so it comes from
 *                                            VITE_FLYCHAM_POS (default "gb").
 */
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLanguageFromPath, DEFAULT_LANGUAGE } from '../../i18n/languages.js'

/** POS segment flycham.com expects in `/{pos}/{lang}/...`. */
export const FLYCHAM_POS = import.meta.env.VITE_FLYCHAM_POS || 'gb'

/** Absolute URLs must leave the SPA instead of going through the router. */
const isExternal = (href) => /^[a-z][a-z0-9+.-]*:\/\//i.test(String(href || ''))

export function usePathname() {
  return useLocation().pathname
}

export function useSearchParams() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export function useParams() {
  const { pathname } = useLocation()
  return useMemo(
    () => ({
      pos: FLYCHAM_POS,
      lang: getLanguageFromPath(pathname) || DEFAULT_LANGUAGE,
    }),
    [pathname],
  )
}

export function useRouter() {
  const navigate = useNavigate()

  return useMemo(
    () => ({
      push(href) {
        if (isExternal(href)) {
          window.location.assign(href)
          return
        }
        navigate(href)
      },
      replace(href) {
        if (isExternal(href)) {
          window.location.replace(href)
          return
        }
        navigate(href, { replace: true })
      },
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => {},
      // Next.js-only route prefetching; nothing to do in a Vite SPA.
      prefetch: () => {},
    }),
    [navigate],
  )
}

export function redirect(href) {
  window.location.assign(href)
}

export function notFound() {
  throw new Error('notFound() is not supported outside Next.js')
}
