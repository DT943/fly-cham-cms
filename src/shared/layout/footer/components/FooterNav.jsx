import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerColumnGroups, footerColumns } from '../utils/footerLinks.js'
import FooterLinkList from './FooterLinkList.jsx'

const headerLinkClass = `m-0 font-semibold tracking-wide text-secondary uppercase no-underline transition-colors hover:text-50 ${typography.caption}`

const ColumnSection = ({ column }) => {
  const { t } = useTranslation()

  return (
    <div className="flex min-w-0 flex-col gap-3.5">
      <h2 className="m-0">
        <LocalizedLink href={column.href} className={headerLinkClass}>
          {t(`layout.footer.columns.${column.id}.title`)}
        </LocalizedLink>
      </h2>
      <FooterLinkList columnId={column.id} links={column.links} />
    </div>
  )
}

const DesktopColumns = () => (
  <div className="hidden min-w-0 flex-1 lg:grid lg:grid-cols-4 lg:gap-x-5 xl:gap-x-8">
    {footerColumnGroups.map((group) => (
      <div key={group.map((column) => column.id).join('-')} className="flex min-w-0 flex-col gap-8">
        {group.map((column) => (
          <ColumnSection key={column.id} column={column} />
        ))}
      </div>
    ))}
  </div>
)

const MobileAccordion = () => {
  const { t } = useTranslation()
  const baseId = useId()
  const [openId, setOpenId] = useState(null)

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="flex flex-col divide-y divide-white/15 border-y border-white/15 lg:hidden">
      {footerColumns.map((column) => {
        const isOpen = openId === column.id
        const panelId = `${baseId}-${column.id}-panel`
        const buttonId = `${baseId}-${column.id}-button`

        return (
          <div key={column.id} className="min-w-0">
            <div className="flex items-center gap-2 py-3.5">
              <LocalizedLink href={column.href} className={`min-w-0 flex-1 ${headerLinkClass}`}>
                {t(`layout.footer.columns.${column.id}.title`)}
              </LocalizedLink>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={t(`layout.footer.columns.${column.id}.title`)}
                onClick={() => toggle(column.id)}
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-secondary"
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
              {isOpen ? <FooterLinkList columnId={column.id} links={column.links} /> : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Footer navigation — desktop column groups, mobile accordion.
 */
const FooterNav = () => (
  <nav aria-label="Footer" className="min-w-0 flex-1">
    <DesktopColumns />
    <MobileAccordion />
  </nav>
)

export default FooterNav
