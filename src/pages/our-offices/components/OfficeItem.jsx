import {
  Clock,
  EnvelopeSimple,
  MapPin,
  MapPinLine,
  Phone,
} from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { getPhoneHref } from '../utils/officeLocations.js'

const ContactRow = ({ icon: Icon, children }) => (
  <div className={`flex items-start gap-2 md:gap-3 ${typography.caption} text-800 min-w-0`}>
    <Icon size={16} weight="regular" className="shrink-0 text-800 mt-0.5" />
    <span className="min-w-0 break-words">{children}</span>
  </div>
)

const OfficeItem = ({ locationId, phone, email, isLast }) => {
  const { t } = useTranslation()
  const name = t(`offices.locations.${locationId}.name`)
  const address = t(`offices.locations.${locationId}.address`)
  const hours = t(`offices.locations.${locationId}.hours`)
  const weekend = t(`offices.locations.${locationId}.weekend`, { defaultValue: '' })

  return (
    <div>
      <div className="flex items-start gap-3 md:gap-6 py-6 md:py-8">
        <div className="relative z-10 flex justify-center w-9 md:w-11 shrink-0">
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-secondary-700 flex items-center justify-center shrink-0">
            <MapPinLine size={22} weight="regular" className="text-700" />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-3 md:gap-4 min-w-0">
            <h3 className={`${typography.itemTitle} font-semibold text-700 m-0`}>
              {name}
            </h3>
            <div className="flex flex-col gap-2 md:gap-2.5 min-w-0">
              <ContactRow icon={MapPin}>{address}</ContactRow>
              <ContactRow icon={Phone}>
                <span dir="ltr">{phone}</span>
              </ContactRow>
              <ContactRow icon={EnvelopeSimple}>
                <a href={`mailto:${email}`} className="text-800 no-underline hover:underline">
                  {email}
                </a>
              </ContactRow>
              <ContactRow icon={Clock}>{hours}</ContactRow>
              {weekend && (
                <span className={`${typography.caption} text-800 ps-7`}>
                  {t('offices.weekend')}: {weekend}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
            <a
              href={getPhoneHref(phone)}
              className={`${typography.button} font-medium text-primary-1 bg-transparent border border-primary-1 no-underline rounded-lg px-3 py-2 md:px-6 md:py-2.5 inline-flex items-center justify-center gap-1.5 md:gap-2.5 flex-1 md:flex-none hover:bg-100`}
            >
              <Phone size={16} weight="regular" className="shrink-0" />
              {t('offices.call')}
            </a>
            <a
              href={`mailto:${email}`}
              className={`${typography.button} font-medium text-primary-1 bg-transparent border border-primary-1 no-underline rounded-lg px-3 py-2 md:px-6 md:py-2.5 inline-flex items-center justify-center gap-1.5 md:gap-2.5 flex-1 md:flex-none hover:bg-100`}
            >
              <EnvelopeSimple size={16} weight="regular" className="shrink-0" />
              {t('offices.email')}
            </a>
          </div>
        </div>
      </div>

      {!isLast && <hr className="border-none border-t border-200 m-0 ms-12 md:ms-[4.25rem]" />}
    </div>
  )
}

export default OfficeItem
