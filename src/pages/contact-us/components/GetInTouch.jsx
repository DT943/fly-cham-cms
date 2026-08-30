import { Clock } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import agentPhoto from '../../../assets/images/contact-us/ph2.png'
import { typography } from '../../../styles/typography.js'

const PHONE_DISPLAY = '+963 -11-2122222'
const PHONE_HREF = 'tel:+963112122222'

const GetInTouch = () => {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-background md:bg-transparent px-4 pb-6 md:px-0 md:pb-0">
      <div className="bg-200 rounded-3xl md:rounded-t-3xl md:rounded-b-none">
        <div className="max-w-[1222px] mx-auto px-5 py-8 md:px-10 md:py-14 flex flex-col items-center text-center gap-3 md:gap-4">
          <h2 className={`${typography.sectionTitle} font-bold text-700 m-0`}>
            {t('contact.getInTouch.title')}
          </h2>
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-background p-1.5 shrink-0">
            <img
              src={agentPhoto}
              alt={t('contact.getInTouch.imageAlt')}
              className="w-full h-full rounded-full object-cover object-center"
            />
          </div>
          <p className={`${typography.body} font-medium text-600 md:text-700 m-0`}>
            {t('contact.getInTouch.label')}
          </p>
          <a
            href={PHONE_HREF}
            dir="ltr"
            className={`${typography.pageTitle} font-bold text-primary-1 no-underline hover:underline leading-tight`}
          >
            {PHONE_DISPLAY}
          </a>
          <p className={`${typography.caption} text-700 font-medium m-0 inline-flex items-center justify-center gap-1.5`}>
            <span className="md:hidden">{t('contact.getInTouch.hoursMobile')}</span>
            <span className="hidden md:inline">{t('contact.getInTouch.hours')}</span>
            <Clock size={14} weight="regular" className="shrink-0" />
          </p>
          <p className={`${typography.caption} text-500 m-0 w-full leading-relaxed md:text-700 md:whitespace-nowrap`}>
            {t('contact.getInTouch.note')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default GetInTouch
