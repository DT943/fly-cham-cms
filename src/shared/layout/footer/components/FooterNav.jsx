import { useId, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { colorVar } from '../../../../styles/cmsStyle.js'
import { FTR_HOVER, footerHref, roleStyle } from '../utils/footerStyle.js'
import FooterItemIcon from './FooterItemIcon.jsx'
import FooterLinkList from './FooterLinkList.jsx'

/** Figma: gold titles are plain text (not links), 18px semibold. */
const titleClass =
  'm-0 text-[14px] font-semibold leading-normal sm:text-[15px] md:text-[16px] lg:text-[18px]'

const mobileTitleClass = `m-0 min-w-0 flex-1 text-[14px] font-semibold no-underline transition-colors sm:text-[15px] ${FTR_HOVER}`

const withIcon = (icon) => (icon ? ' inline-flex items-center gap-1.5' : '')

const DESKTOP_GROUPS = [1, 2, 3, 4]

const ColumnSection = ({ column, style, titleStyle }) => (
  <div className="flex min-w-0 flex-col gap-4">
    <h2 className={`${titleClass}${withIcon(column.icon)}`} style={titleStyle}>
      <FooterItemIcon name={column.icon} />
      {column.title}
    </h2>
    <FooterLinkList links={column.links} style={style} />
  </div>
)

/**
 * Figma columns: 4 groups spread across the content track (starts ~0 / 323 / 632 / 1034
 * on a 1219 track) — space-between, not equal-width grid. Stacked sections in a
 * group share ~28–32px vertical gap.
 */
const DesktopColumns = ({ columns, style }) => {
  const titleStyle = {
    color: colorVar(style.columnTitleColor || 'primary-3'),
  }

  return (
    <>
      <div className="hidden min-w-0 w-full md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-8 lg:hidden">
        {columns.map((column) => (
          <div key={column.id} className="min-w-0 self-start">
            <ColumnSection column={column} style={style} titleStyle={titleStyle} />
          </div>
        ))}
      </div>

      <div className="hidden min-w-0 w-full lg:flex lg:flex-row lg:items-start lg:justify-between lg:gap-x-8 xl:gap-x-10">
        {DESKTOP_GROUPS.map((group) => {
          const groupColumns = columns.filter((column) => column.group === group)
          if (groupColumns.length === 0) return null
          return (
            <div
              key={group}
              className="flex w-max max-w-[15rem] shrink-0 flex-col gap-7 xl:gap-8"
            >
              {groupColumns.map((column) => (
                <ColumnSection
                  key={column.id}
                  column={column}
                  style={style}
                  titleStyle={titleStyle}
                />
              ))}
            </div>
          )
        })}
      </div>
    </>
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
    <div className="flex flex-col divide-y divide-(--ftr-divider-15) border-y border-(--ftr-divider-15) md:hidden">
      {columns.map((column) => {
        const isOpen = openId === column.id
        const panelId = `${baseId}-${column.id}-panel`
        const buttonId = `${baseId}-${column.id}-button`

        return (
          <div key={column.id} className="min-w-0">
            <div className="flex items-center gap-2 py-3 sm:py-3.5">
              <LocalizedLink
                href={footerHref(column.href)}
                className={`${mobileTitleClass}${withIcon(column.icon)}`}
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

const FooterNav = ({ columns, style }) => (
  <nav aria-label="Footer" className="min-w-0 w-full">
    <DesktopColumns columns={columns} style={style} />
    <MobileAccordion columns={columns} style={style} />
  </nav>
)

export default FooterNav
