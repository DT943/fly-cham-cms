import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { contactForms } from '../utils/contactForms.jsx'
import ContactFormCard from './ContactFormCard.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const ContactForms = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-2">
        <h2 className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
          {t('contact.forms.title')}
        </h2>
        <p className={`${typography.sectionDescription} text-700 m-0`}>
          {t('contact.forms.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {contactForms.map((form) => (
          <ContactFormCard
            key={form.id}
            icon={form.icon}
            href={form.href}
            title={t(`contact.forms.items.${form.id}.title`)}
            description={t(`contact.forms.items.${form.id}.description`)}
          />
        ))}
      </div>
      <div className="flex justify-center">
        <LocalizedLink
          href="/help/forms"
          className={`${typography.button} mt-0 md:mt-4 font-semibold text-primary-1 bg-background border border-primary-1 hover:bg-100 no-underline rounded-lg px-10 py-3`}
        >
          {t('contact.forms.viewAll')}
        </LocalizedLink>
      </div>
    </section>
  )
}

export default ContactForms
