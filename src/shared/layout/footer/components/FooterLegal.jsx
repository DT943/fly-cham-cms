import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER_COLOR, footerHref, legalStyle } from '../utils/footerStyle.js'
import { colorVar } from '../../../../styles/cmsStyle.js'

/** Figma legal: 14px, links gap 16px, bar py 24px, px 350 on 1920. */
const linkClass = `text-[12px] leading-[1.5] no-underline transition-colors sm:text-[13px] md:text-[14px] ${FTR_HOVER_COLOR}`

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

const FooterLegal = ({ legal, style }) => {
  const textStyle = legalStyle(style)
  const copyright = legal.copyright ? (
    <p
      className="m-0 shrink-0 text-[12px] leading-[1.5] text-50 sm:text-[13px] md:text-[14px]"
      style={{ color: colorVar(style.legalColor || '50') }}
    >
      {legal.copyright}
    </p>
  ) : null

  return (
    <div
      className="relative z-10 w-full"
      style={{ backgroundColor: colorVar(style.legalBg || 'secondary-2') }}
    >
      <div className="mx-auto flex w-full max-w-page flex-col gap-4 px-4 py-5 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-8 md:py-6 lg:px-10 lg:py-6 xl:px-0 xl:py-6">
        <div className="flex flex-col gap-3 md:hidden">
          <LegalLinks
            links={legal.links.filter((link) => link.showOnMobile)}
            className="m-0 flex list-none flex-col gap-2.5 p-0"
            textStyle={textStyle}
          />
          {copyright}
        </div>

        <div className="hidden w-full md:flex md:flex-row md:items-center md:justify-between md:gap-6">
          {copyright}
          <LegalLinks
            links={legal.links}
            className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0"
            textStyle={textStyle}
          />
        </div>
      </div>
    </div>
  )
}

export default FooterLegal
