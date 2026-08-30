import { useTranslation } from 'react-i18next'

const HeroText = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold text-primary-1 leading-tight">
        {t('help.hero.title')}
      </h1>
      <p className="text-base md:text-lg font-medium text-700">
        {t('help.hero.subtitle')}
      </p>
    </div>
  )
}

export default HeroText
