import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import ContactHeroImage from './ContactHeroImage.jsx'

const ContactHero = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col md:flex-row md:items-center gap-5 md:gap-10 lg:gap-14">
      <div className="order-1 md:order-2 md:w-1/2 lg:w-[54%] shrink-0">
        <ContactHeroImage />
      </div>
      <div className="order-2 md:order-1 flex-1 flex flex-col gap-2 md:gap-4">
        <h1 className={`${typography.pageTitle} font-bold text-primary-1 leading-tight m-0`}>
          {t('contact.hero.title')}
        </h1>
        <p className={`${typography.sectionDescription} font-medium text-700 m-0`}>
          {t('contact.hero.subtitle')}
        </p>
      </div>
    </section>
  )
}

export default ContactHero
