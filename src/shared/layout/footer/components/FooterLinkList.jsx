import { ArrowSquareOut } from '@phosphor-icons/react'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER, footerHref, roleStyle } from '../utils/footerStyle.js'
import FooterItemIcon from './FooterItemIcon.jsx'

/**
 * Figma: 16px regular white links in 17px rows (text centred), 16px vertical
 * gap → 33px pitch; nowrap on desktop.
 */
const linkClass = `inline-flex items-center gap-1 text-[13px] leading-[17px] no-underline transition-colors sm:text-[14px] md:text-[15px] lg:whitespace-nowrap lg:text-[16px] ${FTR_HOVER}`

const FooterLinkList = ({ links, style }) => {
  const normal = roleStyle({
    color: style.linkColor,
    colorHover: style.linkColorHover,
    weight: style.linkFontWeight,
  })
  const highlighted = roleStyle({
    color: style.highlightColor,
    colorHover: style.linkColor,
    weight: 'semibold',
  })

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0">
      {links.map((link) => (
        <li key={link.id} className="flex">
          {/*
            `flex` li: no inherited 24px line box around the 17px link.
            External: Figma 41944:18837 — 16px ArrowSquareOut top-aligned in the
            17px row (glyph spans cap height to baseline), 4px after the label.
          */}
          <LocalizedLink
            href={footerHref(link.href)}
            className={linkClass}
            style={link.highlight ? highlighted : normal}
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <FooterItemIcon name={link.icon} />
            <span className="min-w-0">{link.label}</span>
            {link.external ? (
              <ArrowSquareOut
                size={16}
                weight="regular"
                aria-hidden
                className="-ms-0.5 size-4 shrink-0 self-start"
              />
            ) : null}
          </LocalizedLink>
        </li>
      ))}
    </ul>
  )
}

export default FooterLinkList
