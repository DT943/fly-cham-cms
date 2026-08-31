import { Chats } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const LiveChatBanner = () => {
  const { t } = useTranslation()

  return (
    <section className="bg-primary-1/10 rounded-2xl px-5 py-5 md:px-8 md:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5 min-w-0">
          <div className="flex items-center gap-3 md:contents">
            <Chats
              size={32}
              weight="regular"
              className="text-700 shrink-0"
            />
            <h2 className={`${typography.itemTitle} font-bold text-700 m-0 md:hidden`}>
              {t('offices.liveChat.title')}
            </h2>
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <h2 className={`${typography.itemTitle} font-bold text-700 m-0 hidden md:block`}>
              {t('offices.liveChat.title')}
            </h2>
            <p className={`${typography.itemDescription} text-600 m-0 leading-relaxed`}>
              {t('offices.liveChat.description')}
            </p>
          </div>
        </div>
        <a
          href="#"
          className={`${typography.button} font-medium text-50 bg-primary-1 hover:bg-primary-800 no-underline rounded-lg px-6 py-3 w-full md:w-auto inline-flex items-center justify-center shrink-0 transition-colors`}
        >
          {t('offices.liveChat.cta')}
        </a>
      </div>
    </section>
  )
}

export default LiveChatBanner
