import { ArrowSquareOut } from '@phosphor-icons/react'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER, footerHref, roleStyle } from '../utils/footerStyle.js'

const linkClass = `${typography.caption} inline-flex items-center gap-1.5 no-underline transition-colors ${FTR_HOVER}`

const FooterLinkList = ({ links, style }) => {
  const normal = roleStyle({
    color: style.linkColor,
    colorHover: style.linkColorHover,
    weight: style.linkFontWeight,
  })
  // Highlighted links: highlight colour, semibold; hover → the normal link colour.
  const highlighted = roleStyle({
    color: style.highlightColor,
    colorHover: style.linkColor,
    weight: 'semibold',
  })

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {links.map((link) => (
        <li key={link.id}>
          <LocalizedLink
            href={footerHref(link.href)}
            className={linkClass}
            style={link.highlight ? highlighted : normal}
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {link.label}
            {link.external ? (
              <ArrowSquareOut size={14} weight="regular" aria-hidden className="shrink-0" />
            ) : null}
          </LocalizedLink>
        </li>
      ))}
    </ul>
  )
}

export default FooterLinkList
