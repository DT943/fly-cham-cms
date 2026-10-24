import { ArrowSquareOut } from '@phosphor-icons/react'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER, footerHref, roleStyle } from '../utils/footerStyle.js'
import FooterItemIcon from './FooterItemIcon.jsx'

/** Figma: 16px regular white links, 16px vertical gap; long labels wrap within their column. */
const linkClass = `inline-flex max-w-full items-center gap-1 text-[13px] leading-normal no-underline transition-colors sm:text-[14px] md:text-[15px] whitespace-normal break-words lg:text-[16px] ${FTR_HOVER}`

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
        <li key={link.id} className="min-h-[17px]">
          <LocalizedLink
            href={footerHref(link.href)}
            className={linkClass}
            style={link.highlight ? highlighted : normal}
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <FooterItemIcon name={link.icon} />
            {link.label}
            {link.external ? (
              <ArrowSquareOut size={16} weight="regular" aria-hidden className="shrink-0" />
            ) : null}
          </LocalizedLink>
        </li>
      ))}
    </ul>
  )
}

export default FooterLinkList
