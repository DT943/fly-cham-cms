import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER_COLOR, footerHref, legalStyle } from '../utils/footerStyle.js'

const linkClass = `${typography.caption} no-underline transition-colors ${FTR_HOVER_COLOR}`

const LegalLinks = ({ links, className, textStyle }) => (
  <ul className={className}>
    {links.map((link) => (
      <li key={link.id}>
        <LocalizedLink href={footerHref(link.href)} className={linkClass} style={textStyle}>
          {link.label}
        </LocalizedLink>
      </li>
    ))}
  </ul>
)

/**
 * Footer bottom bar.
 * - Mobile/tablet (< lg): legal links flagged `showOnMobile` stacked, copyright last.
 * - lg+: copyright start, every legal link inline end.
 */
const FooterLegal = ({ legal, style }) => {
  const textStyle = legalStyle(style)
  const copyright = legal.copyright ? (
    <p className={`m-0 ${typography.caption}`} style={{ color: textStyle.color }}>
      {legal.copyright}
    </p>
  ) : null

  return (
    <>
      <div className="flex flex-col gap-5 lg:hidden">
        <LegalLinks
          links={legal.links.filter((link) => link.showOnMobile)}
          className="m-0 flex list-none flex-col gap-2.5 p-0"
          textStyle={textStyle}
        />
        {copyright}
      </div>

      <div className="hidden border-t border-(--ftr-divider-20) pt-6 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {copyright}
        <LegalLinks
          links={legal.links}
          className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0 md:gap-x-5"
          textStyle={textStyle}
        />
      </div>
    </>
  )
}

export default FooterLegal
