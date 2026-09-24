import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'

const FooterLegal = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 border-t border-white/15 pt-6">
      <p className={`m-0 text-50/80 ${typography.caption}`}>
        {t('layout.footer.copyright')}
      </p>
      <ul className="m-0 flex list-none flex-wrap items-center gap-4 p-0 md:gap-6">
        <li>
          <LocalizedLink
            href="/coming-soon"
            className={`${typography.caption} text-50/80 no-underline transition-colors hover:text-primary-2`}
          >
            {t('layout.footer.legal.sitemap')}
          </LocalizedLink>
        </li>
      </ul>
    </div>
  )
}

export default FooterLegal
