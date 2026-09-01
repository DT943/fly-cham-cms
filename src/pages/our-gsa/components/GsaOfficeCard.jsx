import {
  ArrowRight,
  EnvelopeSimple,
  MapPin,
  Phone,
} from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { getMapsHref, getPhoneHref } from '../utils/gsaLocations.js'

const DetailRow = ({ icon: Icon, children }) => (
  <div className={`flex items-start gap-2 ${typography.caption} text-700 min-w-0`}>
    <Icon size={16} weight="regular" className="shrink-0 text-700 mt-0.5" />
    <span className="min-w-0 wrap-break-word">{children}</span>
  </div>
)

const GsaOfficeCard = ({ office, locationId, isSelected, onSelect }) => {
  const { t } = useTranslation()
  const name = t(`gsa.locations.${locationId}.name`)
  const address = t(`gsa.locations.${locationId}.address`)

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      className={`bg-background rounded-lg p-5 flex flex-col gap-4 cursor-pointer ${
        isSelected
          ? 'border border-primary-1'
          : 'border border-transparent shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
      }`}
      onClick={() => onSelect(locationId)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(locationId)
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`${typography.itemTitle} font-semibold text-secondary-2 m-0`}>
          {name}
        </h3>
        {isSelected && (
          <a
            href={getMapsHref(office.lat, office.lng)}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            aria-label={t('gsa.openMap')}
            className="w-8 h-8 shrink-0 no-underline grid place-items-center"
          >
            <span className="w-6 h-6 border border-primary-1 rotate-45 grid place-items-center">
              <ArrowRight
                size={14}
                weight="bold"
                className="text-primary-1 -rotate-45 rtl:-scale-x-100"
              />
            </span>
          </a>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <DetailRow icon={MapPin}>{address}</DetailRow>
        <DetailRow icon={Phone}>
          <a
            href={getPhoneHref(office.phone)}
            dir="ltr"
            className="text-600 no-underline hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            {office.phone}
          </a>
        </DetailRow>
        <DetailRow icon={EnvelopeSimple}>
          <a
            href={`mailto:${office.email}`}
            className="text-600 no-underline hover:underline break-all"
            onClick={(event) => event.stopPropagation()}
          >
            {office.email}
          </a>
        </DetailRow>
      </div>

      <div className={`${typography.caption} text-primary-1 font-medium flex items-center justify-between gap-3 pt-3 border-t border-200`}>
        <span>{office.days}</span>
        <span dir="ltr">{office.hours}</span>
      </div>
    </article>
  )
}

export default GsaOfficeCard
