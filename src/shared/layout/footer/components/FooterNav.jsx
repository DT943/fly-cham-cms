import { useId, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { colorVar } from '../../../../styles/cmsStyle.js'
import { FTR_HOVER, footerHref, roleStyle } from '../utils/footerStyle.js'
import FooterItemIcon from './FooterItemIcon.jsx'
import FooterLinkList from './FooterLinkList.jsx'

/** Figma: gold titles are plain text (not links), 18px semibold, line-height normal. */
const titleClass =
  'm-0 text-[14px] font-semibold leading-[normal] sm:text-[15px] md:text-[16px] lg:whitespace-nowrap lg:text-[18px]'

const mobileTitleClass = `m-0 min-w-0 flex-1 text-[14px] font-semibold no-underline transition-colors sm:text-[15px] ${FTR_HOVER}`

const withIcon = (icon) => (icon ? ' inline-flex items-center gap-1.5' : '')

const DESKTOP_GROUPS = [1, 2, 3, 4]

/**
 * Figma column starts on the 1220 content track: 0 / 323 / 632 / 1034. Tracks
 * keep those proportions at every width and only grow past them when a label
 * needs the room (min `auto` = widest nowrap label).
 */
const DESKTOP_GRID = {
  gridTemplateColumns: [323, 309, 402, 186]
    .map((share) => `minmax(auto, ${share}fr)`)
    .join(' '),
}

const ColumnSection = ({ column, style, titleStyle, className = '', gridStyle }) => (
  <div className={`flex flex-col gap-4 ${className}`} style={gridStyle}>
    <h2 className={`${titleClass}${withIcon(column.icon)}`} style={titleStyle}>
      <FooterItemIcon name={column.icon} />
      {column.title}
    </h2>
    <FooterLinkList links={column.links} style={style} />
  </div>
)

/**
 * Figma: sections sit in rows across the 4 groups — every group's 2nd section
 * starts on the same line, 28px below the tallest 1st section — so each section
 * is placed on grid row = its index in the group, column = its group.
 */
const DesktopColumns = ({ columns, style }) => {
  const titleStyle = {
    color: colorVar(style.columnTitleColor || 'primary-3'),
  }

  const groups = DESKTOP_GROUPS.map((group) =>
    columns.filter((column) => column.group === group),
  )
  const rows = Array.from({ length: Math.max(0, ...groups.map((group) => group.length)) },
    (_, index) => groups.map((group) => group[index]),
  )

  return (
    <>
      <div className="hidden min-w-0 w-full md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-8 lg:hidden">
        {columns.map((column) => (
          <div key={column.id} className="min-w-0 self-start">
            <ColumnSection column={column} style={style} titleStyle={titleStyle} />
          </div>
        ))}
      </div>

      <div
        className="hidden min-w-0 w-full lg:grid lg:items-start lg:gap-y-7"
        style={DESKTOP_GRID}
      >
        {DESKTOP_GROUPS.flatMap((group) =>
          columns
            .filter((column) => column.group === group)
            .map((column, index) => (
              <ColumnSection
                key={column.id}
                column={column}
                style={style}
                titleStyle={titleStyle}
                className="pe-4"
                gridStyle={{ gridColumn: group, gridRow: index + 1 }}
              />
            ))
        )}
      </div>
    </>
  )
}

const MobileAccordion = ({ columns, style }) => {
  const baseId = useId()
  // All sections open by default; users can still collapse individually.
  const [openIds, setOpenIds] = useState(() => new Set(columns.map((column) => column.id)))
  const titleStyle = roleStyle({
    color: style.mobileTitleColor,
    colorHover: style.mobileTitleColorHover,
    weight: style.mobileTitleFontWeight,
  })

  const toggle = (id) => {
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // No bottom border: the footer's own divider follows the last section, and a
  // second line under it read as a double divider.
  return (
    <div className="flex flex-col divide-y divide-(--ftr-divider-15) border-t border-(--ftr-divider-15) md:hidden">
      {columns.map((column) => {
        const isOpen = openIds.has(column.id)
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
