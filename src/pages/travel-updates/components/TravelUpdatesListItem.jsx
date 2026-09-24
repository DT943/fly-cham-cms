import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

/**
 * Single travel update entry — white card matching the advisory panel.
 */
const TravelUpdatesListItem = ({ entry }) => {
  const { t } = useTranslation()
  const { id, dateKey, accentTitle, showLearnMore, href } = entry

  return (
    <article className="rounded-2xl border border-200 bg-50 p-5 shadow-[0_2px_16px_rgba(33,37,41,0.05)] sm:p-7 md:p-8">
      <div className="flex flex-col gap-3 md:gap-4">
        <span
          className={`w-fit rounded-md bg-200 px-2.5 py-1 font-semibold uppercase tracking-wide text-secondary-800 ${typography.caption}`}
        >
          {t(`travelUpdates.dates.${dateKey}`)}
        </span>

        <h3
          className={`m-0 font-semibold ${typography.itemTitle} md:text-xl ${
            accentTitle ? 'text-primary-1' : 'text-800'
          }`}
        >
          {t(`travelUpdates.entries.${id}.title`)}
        </h3>

        <p className={`m-0 max-w-4xl leading-relaxed text-700 ${typography.body}`}>
          {t(`travelUpdates.entries.${id}.description`)}
        </p>

        {showLearnMore && href ? (
          <LocalizedLink
            href={href}
            className={`mt-1 inline-flex w-fit items-center gap-2.5 font-semibold text-primary-1 no-underline transition-opacity hover:opacity-80 ${typography.button}`}
          >
            <span className="grid size-9 place-items-center rounded-full bg-primary-1 text-50">
              <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
            </span>
            {t('travelUpdates.learnMore')}
          </LocalizedLink>
        ) : null}
      </div>
    </article>
  )
}

export default TravelUpdatesListItem
