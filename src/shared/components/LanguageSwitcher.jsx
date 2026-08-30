import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()
  const current = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      <button
        type="button"
        className={`cursor-pointer bg-transparent border-none p-0 ${current === 'en' ? 'text-primary-1' : 'text-600'}`}
        onClick={() => i18n.changeLanguage('en')}
      >
        {t('common.english')}
      </button>
      <span className="text-300">|</span>
      <button
        type="button"
        className={`cursor-pointer bg-transparent border-none p-0 ${current === 'ar' ? 'text-primary-1' : 'text-600'}`}
        onClick={() => i18n.changeLanguage('ar')}
      >
        {t('common.arabic')}
      </button>
    </div>
  )
}

export default LanguageSwitcher
