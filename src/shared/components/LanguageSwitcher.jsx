import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { replaceLanguage } from '../../i18n/languages.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'
import { typography } from '../../styles/typography.js'

const LanguageSwitcher = () => {
  const { t } = useTranslation()
  const { pathname, search, hash } = useLocation()
  const current = useCurrentLanguage()

  const toLanguage = (lang) => `${replaceLanguage(pathname, lang)}${search}${hash}`

  return (
    <div className={`flex items-center gap-2 ${typography.button} font-semibold`}>
      <Link
        to={toLanguage('en')}
        className={`no-underline ${current === 'en' ? 'text-primary-1' : 'text-600'}`}
      >
        {t('common.english')}
      </Link>
      <span className="text-300">|</span>
      <Link
        to={toLanguage('ar')}
        className={`no-underline ${current === 'ar' ? 'text-primary-1' : 'text-600'}`}
      >
        {t('common.arabic')}
      </Link>
    </div>
  )
}

export default LanguageSwitcher
