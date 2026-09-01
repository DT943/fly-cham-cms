import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import { footerLegal } from '../utils/footerLinks.js'

const FooterLegal = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 pt-6 border-t border-secondary/40">
      <p className={`${typography.caption} m-0 text-50`}>
        {t('layout.footer.copyright')}
      </p>
      <ul className="list-none m-0 p-0 flex flex-wrap items-center gap-4 md:gap-6">
        {footerLegal.map((id) => (
          <li key={id}>
            <a href="#" className={`${typography.caption} text-50 no-underline hover:text-secondary`}>
              {t(`layout.footer.legal.${id}`)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterLegal
