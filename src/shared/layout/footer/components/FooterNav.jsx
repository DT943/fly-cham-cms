import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerColumns } from '../utils/footerLinks.js'
import FooterLinkList from './FooterLinkList.jsx'

const headerLinkClass = `m-0 font-semibold tracking-wide text-primary-2 uppercase no-underline transition-colors hover:text-50 ${typography.caption}`

const DesktopColumns = () => {
  const { t } = useTranslation()

  return (
    <div className="hidden grid-cols-4 gap-x-8 gap-y-10 md:grid">
      {footerColumns.map((column) => (
        <div key={column.id} className="flex min-w-0 flex-col gap-3.5">
          <h2 className="m-0">
            <LocalizedLink href={column.href} className={headerLinkClass}>
              {t(`layout.footer.columns.${column.id}.title`)}
            </LocalizedLink>
          </h2>
          <FooterLinkList columnId={column.id} links={column.links} />
        </div>
      ))}
    </div>
  )
}

const MobileAccordion = () => {
  const { t } = useTranslation()
  const baseId = useId()
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="flex flex-col divide-y divide-white/15 border-y border-white/15 md:hidden">
      {footerColumns.map((column) => {
        const isOpen = openId === column.id
        const panelId = `${baseId}-${column.id}-panel`
        const buttonId = `${baseId}-${column.id}-button`

        return (
          <div key={column.id} className="min-w-0">
            <div className="flex items-center gap-2 py-3.5">
              <LocalizedLink
                href={column.href}
                className={`min-w-0 flex-1 ${headerLinkClass}`}
              >
                {t(`layout.footer.columns.${column.id}.title`)}
              </LocalizedLink>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={t(`layout.footer.columns.${column.id}.title`)}
                onClick={() => toggle(column.id)}
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-primary-2"
              >
                <CaretDown
                  size={16}
                  weight="bold"
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
            </div>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={isOpen ? 'pb-4' : undefined}
            >
              {isOpen ? (
                <FooterLinkList columnId={column.id} links={column.links} />
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Desktop: 4 columns × 2 rows. Mobile: exclusive accordion headers.
 */
const FooterNav = () => (
  <nav aria-label="Footer">
    <DesktopColumns />
    <MobileAccordion />
  </nav>
)

export default FooterNav
