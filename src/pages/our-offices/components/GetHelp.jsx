import { Headset, ClipboardText } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import GetHelpCard from './GetHelpCard.jsx'

const items = [
  { id: 'customerCare', icon: Headset, href: '/help/contact-us' },
  { id: 'forms', icon: ClipboardText, href: '/help/forms' },
]

const GetHelp = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h2 className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
          {t('offices.getHelp.title')}
        </h2>
        <p className={`${typography.sectionDescription} text-700 m-0`}>
          {t('offices.getHelp.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {items.map((item) => (
          <GetHelpCard
            key={item.id}
            icon={item.icon}
            href={item.href}
            title={t(`offices.getHelp.items.${item.id}.title`)}
            description={t(`offices.getHelp.items.${item.id}.description`)}
          />
        ))}
      </div>
    </section>
  )
}

export default GetHelp
