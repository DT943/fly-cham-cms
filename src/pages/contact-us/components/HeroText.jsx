import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const HeroText = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`${typography.pageTitle} font-bold text-primary-1 leading-tight`}>
        {t('help.hero.title')}
      </h1>
      <p className={`${typography.sectionDescription} font-medium text-700`}>
        {t('help.hero.subtitle')}
      </p>
    </div>
  )
}

export default HeroText
