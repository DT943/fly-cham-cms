import LocalizedLink from '../LocalizedLink.jsx'
import { colorMix } from '../../../styles/cmsStyle.js'

/**
 * Sticky in-page legal navigation. Active item uses the accent border;
 * items without an href render as placeholders.
 */
const LegalDocumentNav = ({ items = [], activeId = '' }) => {
  if (!items.length) return null

  const activeWash = colorMix('secondary-1', 15)
  const hoverWash = colorMix('secondary-1', 10)

  return (
    <nav className="flex flex-col gap-1 rounded-xl bg-50 py-2 lg:sticky lg:top-4">
      {items.map((item, index) => {
        const id = item.id || `nav-${index}`
        const isActive = Boolean(activeId) && id === activeId

        if (isActive) {
          return (
            <span
              key={id}
              aria-current="page"
              className="border-s-[3px] border-primary-1 px-4 py-3 text-base font-semibold text-primary-1"
              style={{ backgroundColor: activeWash }}
            >
              {item.label}
            </span>
          )
        }

        if (item.href) {
          return (
            <LocalizedLink
              key={id}
              href={item.href}
              className="rounded-lg px-4 py-3 text-base font-medium text-800 no-underline transition-colors"
              style={{ '--legal-nav-hover': hoverWash }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = hoverWash
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.label}
            </LocalizedLink>
          )
        }

        return (
          <span
            key={id}
            className="rounded-lg px-4 py-3 text-base font-medium text-800"
          >
            {item.label}
          </span>
        )
      })}
    </nav>
  )
}

export default LegalDocumentNav
