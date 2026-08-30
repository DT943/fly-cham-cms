import { useTranslation } from 'react-i18next'
import urgentHelpBg from '../../../assets/images/contact-us/ph1.png'
import Button from '../../../shared/components/Button.jsx'
import { typography } from '../../../styles/typography.js'

const UrgentHelp = () => {
  const { t } = useTranslation()

  return (
    <section
      className="relative rounded-xl overflow-hidden w-full min-h-[300px] md:min-h-[415px] bg-cover bg-center flex items-center px-8 sm:px-12 md:px-20 py-12 md:py-16"
      style={{ backgroundImage: `url(${urgentHelpBg})` }}
    >
      <div className="absolute inset-0 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-secondary-2/86 via-secondary-2/40 to-transparent z-[1]" />

      <div className="relative z-[2] flex flex-col gap-6 max-w-xl">
        <h2 className={`${typography.sectionTitle} font-semibold text-50 m-0`}>
          {t('help.urgent.title')}
        </h2>
        <p className={`${typography.sectionDescription} font-medium text-50 m-0 leading-relaxed`}>
          {t('help.urgent.description')}
        </p>
        <Button>{t('help.urgent.cta')}</Button>
      </div>
    </section>
  )
}

export default UrgentHelp
