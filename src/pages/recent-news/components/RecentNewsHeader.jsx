import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const RecentNewsHeader = () => {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-4 md:gap-5">
      <h1
        className={`m-0 font-bold leading-tight text-primary-1 ${typography.pageTitle} lg:text-[44px]`}
      >
        {t('recentNews.title')}
      </h1>
      <p
        className={`m-0 w-full font-normal leading-relaxed text-700 md:text-lg ${typography.sectionDescription}`}
      >
        {t('recentNews.description')}
      </p>
    </header>
  )
}

export default RecentNewsHeader
