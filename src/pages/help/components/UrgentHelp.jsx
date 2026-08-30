import { useTranslation } from 'react-i18next'
import urgentHelpBg from '../../../assets/images/help/ph1.png'
import Button from '../../../shared/components/Button.jsx'
import { typography } from '../../../styles/typography.js'

const UrgentHelp = () => {
  const { t } = useTranslation()

  return (
    <section
      className="relative rounded-xl overflow-hidden w-full min-h-[260px] md:min-h-[415px] bg-cover bg-center flex items-end md:items-center px-5  sm:px-12 md:px-20 "
      style={{ backgroundImage: `url(${urgentHelpBg})` }}
    >
      <div className="absolute inset-0 z-[1] rtl:bg-[linear-gradient(to_right,rgb(5_78_114/0)_0%,#054E72_100%)] ltr:bg-[linear-gradient(to_left,rgb(5_78_114/0)_0%,#054E72_100%)]" />

      <div className="relative z-[2] flex flex-col gap-4 md:gap-6 max-w-xl">
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
