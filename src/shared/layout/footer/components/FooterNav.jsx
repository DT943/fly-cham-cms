import { useId, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER, footerHref, roleStyle } from '../utils/footerStyle.js'
import FooterItemIcon from './FooterItemIcon.jsx'
import FooterLinkList from './FooterLinkList.jsx'

const headerLinkClass = `m-0 tracking-wide uppercase no-underline transition-colors ${FTR_HOVER} ${typography.caption}`

// Mobile accordion row title (design): title case.
const mobileTitleClass = `m-0 no-underline transition-colors ${FTR_HOVER} ${typography.caption}`

// Only titles that carry an icon become flex rows, so icon-less titles render exactly as before.
const withIcon = (icon) => (icon ? " inline-flex items-center gap-1.5" : "")

/** Desktop grid columns; a column's sections are the `columns` with that `group`. */
const DESKTOP_GROUPS = [1, 2, 3, 4]

const ColumnSection = ({ column, style, titleStyle }) => (
  <div className="flex min-w-0 flex-col gap-3.5">
    <h2 className="m-0">
      <LocalizedLink href={footerHref(column.href)} className={`${headerLinkClass}${withIcon(column.icon)}`} style={titleStyle}>
        <FooterItemIcon name={column.icon} />
        {column.title}
      </LocalizedLink>
    </h2>
    <FooterLinkList links={column.links} style={style} />
  </div>
)

const DesktopColumns = ({ columns, style }) => {
  const titleStyle = roleStyle({
    color: style.columnTitleColor,
    colorHover: style.columnTitleColorHover,
    weight: style.columnTitleFontWeight,
  })

  return (
    <div className="hidden min-w-0 flex-1 lg:grid lg:grid-cols-4 lg:gap-x-5 xl:gap-x-8">
      {DESKTOP_GROUPS.map((group) => (
        <div key={group} className="flex min-w-0 flex-col gap-8">
          {columns
            .filter((column) => column.group === group)
            .map((column) => (
              <ColumnSection key={column.id} column={column} style={style} titleStyle={titleStyle} />
            ))}
        </div>
      ))}
    </div>
  )
}

const MobileAccordion = ({ columns, style }) => {
  const baseId = useId()
  const [openId, setOpenId] = useState(null)
  const titleStyle = roleStyle({
    color: style.mobileTitleColor,
    colorHover: style.mobileTitleColorHover,
    weight: style.mobileTitleFontWeight,
  })

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="flex flex-col divide-y divide-(--ftr-divider-15) border-y border-(--ftr-divider-15) lg:hidden">
      {columns.map((column) => {
        const isOpen = openId === column.id
        const panelId = `${baseId}-${column.id}-panel`
        const buttonId = `${baseId}-${column.id}-button`

        return (
          <div key={column.id} className="min-w-0">
            <div className="flex items-center gap-2 py-3.5">
              <LocalizedLink
                href={footerHref(column.href)}
                className={`min-w-0 flex-1 ${mobileTitleClass}${withIcon(column.icon)}`}
                style={titleStyle}
              >
                <FooterItemIcon name={column.icon} />
                {column.title}
              </LocalizedLink>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label={column.title}
                onClick={() => toggle(column.id)}
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-50/85"
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
              {isOpen ? <FooterLinkList links={column.links} style={style} /> : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Footer navigation — desktop column groups, mobile accordion (array order).
 */
const FooterNav = ({ columns, style }) => (
  <nav aria-label="Footer" className="min-w-0 flex-1">
    <DesktopColumns columns={columns} style={style} />
    <MobileAccordion columns={columns} style={style} />
  </nav>
)

export default FooterNav
