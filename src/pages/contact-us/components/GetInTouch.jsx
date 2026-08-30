import { Clock } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import agentPhoto from '../../../assets/images/contact-us/ph2.png'
import { typography } from '../../../styles/typography.js'

const PHONE_DISPLAY = '+963 -11-2122222'
const PHONE_HREF = 'tel:+963112122222'

const GetInTouch = () => {
  const { t } = useTranslation()

  return (
    <section className="bg-200 rounded-t-3xl">
      <div className="max-w-[1222px] mx-auto px-6 py-10 md:px-10 md:py-14 flex flex-col items-center text-center gap-4 md:gap-5">
        <h2 className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
          {t('contact.getInTouch.title')}
        </h2>
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-background p-1.5 shrink-0">
          <img
            src={agentPhoto}
            alt={t('contact.getInTouch.imageAlt')}
            className="w-full h-full rounded-full object-cover object-center"
          />
        </div>
        <p className={`${typography.itemTitle} font-medium text-700 m-0`}>
          {t('contact.getInTouch.label')}
        </p>
        <a
          href={PHONE_HREF}
          className={`${typography.pageTitle} font-semibold text-primary-1 no-underline hover:underline leading-tight`}
        >
          {PHONE_DISPLAY}
        </a>
        <p className={`${typography.caption} text-800 font-medium m-0 inline-flex items-center justify-center gap-1.5`}>
          <span>{t('contact.getInTouch.hours')}</span>
          <Clock size={15} weight="regular" className=" shrink-0" />
        </p>
        <p className={`${typography.caption} text-700 m-0 max-w-md leading-relaxed`}>
          {t('contact.getInTouch.note')}
        </p>
      </div>
    </section>
  )
}

export default GetInTouch
