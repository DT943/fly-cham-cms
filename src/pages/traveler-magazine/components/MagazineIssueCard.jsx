import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

/**
 * A single magazine issue: cover image with a "Read" hover overlay, an optional
 * "New" badge, and an "Issue N / Month" caption beneath.
 */
const MagazineIssueCard = ({ issue, month, cover, isNew = false, href }) => {
  const { t } = useTranslation()

  return (
    <LocalizedLink
      href={href}
      className="group flex flex-col gap-2.5 no-underline"
      aria-label={`${t('travelerMagazine.issue.label', { number: issue })} — ${month}`}
    >
      <div className="relative aspect-[293/347] overflow-hidden rounded-xl shadow-[0px_4px_4px_rgba(33,37,41,0.04)]">
        <img src={cover} alt="" className="absolute inset-0 size-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center bg-secondary-2/20 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
          <span className="text-2xl font-medium text-50">{t('travelerMagazine.issue.read')}</span>
        </div>

        {isNew && (
          <span className="absolute start-0 top-3 bg-secondary-1 px-2.5 py-2 text-sm font-semibold text-50">
            {t('travelerMagazine.issue.new')}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-2.5 text-center font-medium text-600">
        <p className="m-0">{t('travelerMagazine.issue.label', { number: issue })}</p>
        <p className="m-0">{month}</p>
      </div>
    </LocalizedLink>
  )
}

export default MagazineIssueCard
