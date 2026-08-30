import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { contactChannels } from '../utils/contactChannels.jsx'
import ContactChannelCard from './ContactChannelCard.jsx'

const ContactChannels = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <h2 className={`${typography.sectionTitle} font-bold text-700 m-0`}>
        {t('contact.channels.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {contactChannels.map((channel) => (
          <ContactChannelCard
            key={channel.id}
            icon={channel.icon}
            href={channel.href}
            title={t(`contact.channels.items.${channel.id}.title`)}
            description={t(`contact.channels.items.${channel.id}.description`)}
            cta={t(`contact.channels.items.${channel.id}.cta`)}
          />
        ))}
      </div>
    </section>
  )
}

export default ContactChannels
