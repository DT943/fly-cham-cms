import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER_COLOR, footerHref, legalStyle } from '../utils/footerStyle.js'
import { colorVar } from '../../../../styles/cmsStyle.js'

/**
 * Figma legal: 14px, bar py 24px on the content track. Links are 114px-min
 * slots in 17px rows, 16px apart, top-aligned with the 21px copyright line —
 * the block ends flush with the track (Site Map lands at 723 on 1920).
 */
const linkClass = `block text-[12px] leading-[1.5] no-underline transition-colors sm:text-[13px] md:text-[14px] xl:min-w-[114px] xl:leading-[17px] ${FTR_HOVER_COLOR}`

const LegalLinks = ({ links, className, textStyle }) => (
  <ul className={className}>
    {links.map((link) => (
      <li key={link.id} className="max-w-full">
        <LocalizedLink href={footerHref(link.href)} className={linkClass} style={textStyle}>
          {link.label}
        </LocalizedLink>
      </li>
    ))}
  </ul>
)

const FooterLegal = ({ legal, style }) => {
  const { i18n } = useTranslation()
  const isArabic = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('ar')
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
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative z-10 w-full text-start"
      style={{ backgroundColor: colorVar(style.legalBg || 'secondary-2') }}
    >
      {/* Same gutters as the footer content above, so both share one left edge */}
      <Container className="flex flex-col gap-4 py-5 md:flex-row md:items-start md:justify-between md:gap-6 md:py-6">
        <div className="flex flex-col gap-3 md:hidden">
          <LegalLinks
            links={legal.links.filter((link) => link.showOnMobile)}
            className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2.5 p-0"
            textStyle={textStyle}
          />
          {copyright}
        </div>

        <div className="hidden w-full md:flex md:flex-row md:items-start md:justify-between md:gap-6">
          {copyright}
          <LegalLinks
            links={legal.links}
            className="m-0 flex list-none flex-wrap items-start gap-x-4 gap-y-2 p-0"
            textStyle={textStyle}
          />
        </div>
      </Container>
    </div>
  )
}

export default FooterLegal
