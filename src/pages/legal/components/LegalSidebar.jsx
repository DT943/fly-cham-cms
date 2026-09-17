import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

// Fixed order from the design. Items with an `href` are live pages; the rest are
// placeholders shown for context until their pages exist.
const NAV_ITEMS = [
  { id: 'hub', href: '/legal' },
  { id: 'privacy', href: '/legal/privacy-policy' },
  { id: 'terms', href: '/legal/terms-and-conditions' },
  { id: 'cookies', href: '/legal/cookies' },
  { id: 'chamMiles' },
  { id: 'ticket', href: '/booking-terms-and-conditions' },
]

/**
 * Sticky in-page navigation for the Terms and Privacy documents. `activeId`
 * marks the current page with the accent border/highlight.
 */
const LegalSidebar = ({ activeId }) => {
  const { t } = useTranslation()

  return (
    <nav className="flex flex-col gap-1 rounded-xl bg-50 py-2 lg:sticky lg:top-4">
      {NAV_ITEMS.map(({ id, href }) => {
        const label = t(`legal.nav.${id}`)
        const isActive = id === activeId

        if (isActive) {
          return (
            <span
              key={id}
              aria-current="page"
              className="border-s-[3px] border-primary-1 bg-secondary-1/15 px-4 py-3 font-semibold text-primary-1 text-base"
            >
              {label}
            </span>
          )
        }

        if (href) {
          return (
            <LocalizedLink
              key={id}
              href={href}
              className="rounded-lg px-4 py-3 font-medium text-800 text-base no-underline transition-colors hover:bg-secondary-1/10"
            >
              {label}
            </LocalizedLink>
          )
        }

        return (
          <span key={id} className="rounded-lg px-4 py-3 font-medium text-800 text-base">
            {label}
          </span>
        )
      })}
    </nav>
  )
}

export default LegalSidebar
