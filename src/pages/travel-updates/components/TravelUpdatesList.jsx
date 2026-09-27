import { useTranslation } from 'react-i18next'
import { TRAVEL_UPDATES_PAGE_SIZE, travelUpdatesEntries } from '../utils/travelUpdates.js'
import TravelUpdatesListItem from './TravelUpdatesListItem.jsx'
import TravelUpdatesPagination from './TravelUpdatesPagination.jsx'

/**
 * Paginated travel updates feed — each entry as a white card.
 */
const TravelUpdatesList = ({ currentPage, onPageChange }) => {
  const { t } = useTranslation()
  const totalPages = Math.max(1, Math.ceil(travelUpdatesEntries.length / TRAVEL_UPDATES_PAGE_SIZE))
  const page = Math.min(Math.max(currentPage, 1), totalPages)
  const start = (page - 1) * TRAVEL_UPDATES_PAGE_SIZE
  const pageEntries = travelUpdatesEntries.slice(start, start + TRAVEL_UPDATES_PAGE_SIZE)

  return (
    <section className="flex min-w-0 flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-4 md:gap-5">
        {pageEntries.map((entry) => (
          <TravelUpdatesListItem key={entry.id} entry={entry} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="pt-4 md:pt-5">
          <TravelUpdatesPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            previousLabel={t('travelUpdates.pagination.previous')}
            nextLabel={t('travelUpdates.pagination.next')}
          />
        </div>
      ) : null}
    </section>
  )
}

export default TravelUpdatesList
