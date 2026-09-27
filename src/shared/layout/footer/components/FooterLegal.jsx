import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerLegalLinks, footerLinkHrefs } from '../utils/footerLinks.js'

/**
 * Footer bottom bar — copyright + legal links.
 */
const FooterLegal = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className={`m-0 text-50/85 ${typography.caption}`}>{t('layout.footer.copyright')}</p>
      <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0 md:gap-x-5">
        {footerLegalLinks.map((linkId) => (
          <li key={linkId}>
            <LocalizedLink
              href={footerLinkHrefs[linkId] || '#'}
              className={`${typography.caption} text-50/85 no-underline transition-colors hover:text-primary-2`}
            >
              {t(`layout.footer.legal.${linkId}`)}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterLegal
