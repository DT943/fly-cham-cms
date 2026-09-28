import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerLegalLinks, footerLinkHrefs, footerMobileLegalLinks } from '../utils/footerLinks.js'

const linkClass = `${typography.caption} text-50/85 no-underline transition-colors hover:text-primary-2`

/**
 * Footer bottom bar.
 * - Mobile/tablet (< lg): legal links stacked, copyright last.
 * - lg+: copyright start, legal links inline end (unchanged).
 */
const FooterLegal = () => {
  const { t } = useTranslation()

  return (
    <>
      <div className="flex flex-col gap-5 lg:hidden">
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {footerMobileLegalLinks.map((linkId) => (
            <li key={linkId}>
              <LocalizedLink href={footerLinkHrefs[linkId] || '#'} className={linkClass}>
                {t(`layout.footer.legal.${linkId}`)}
              </LocalizedLink>
            </li>
          ))}
        </ul>
        <p className={`m-0 text-50/85 ${typography.caption}`}>{t('layout.footer.copyright')}</p>
      </div>

      <div className="hidden border-t border-white/20 pt-6 lg:flex lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <p className={`m-0 text-50/85 ${typography.caption}`}>{t('layout.footer.copyright')}</p>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0 md:gap-x-5">
          {footerLegalLinks.map((linkId) => (
            <li key={linkId}>
              <LocalizedLink href={footerLinkHrefs[linkId] || '#'} className={linkClass}>
                {t(`layout.footer.legal.${linkId}`)}
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default FooterLegal
