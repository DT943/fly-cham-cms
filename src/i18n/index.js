import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ar from './locales/ar.json'
import { getLanguageFromPath } from './languages.js'

const RTL_LANGUAGES = ['ar']

export function applyDocumentDirection(lng) {
  const language = (lng || 'en').split('-')[0]
  const dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr'

  document.documentElement.dir = dir
  document.documentElement.lang = language
}

const languageDetector = new LanguageDetector()
languageDetector.addDetector({
  name: 'urlSuffix',
  lookup() {
    if (typeof window === 'undefined') return undefined
    return getLanguageFromPath(window.location.pathname)
  },
})

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['urlSuffix', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

applyDocumentDirection(i18n.language)
i18n.on('languageChanged', applyDocumentDirection)

export default i18n
