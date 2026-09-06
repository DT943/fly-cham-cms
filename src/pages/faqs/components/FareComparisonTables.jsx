import {
  ArrowUUpLeft,
  ArrowsClockwise,
  Briefcase,
  Clock,
  Coffee,
  EyeSlash,
  ForkKnife,
  Seat,
  TrolleySuitcase,
} from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { getFaqLabel } from '../utils/faqCategories.js'
import { fareComparisonTables } from '../utils/fareComparison.js'

const rowIcons = {
  checked: TrolleySuitcase,
  carryOn: Briefcase,
  change: ArrowsClockwise,
  refund: ArrowUUpLeft,
  seat: Seat,
  beverage: Coffee,
  meal: ForkKnife,
  noShow: EyeSlash,
  within24h: Clock,
}

const FareRowLabel = ({ row, language }) => {
  const Icon = rowIcons[row.id]

  return (
    <span className="flex items-start gap-2.5 min-w-0">
      {Icon && (
        <Icon
          size={20}
          weight="regular"
          className="shrink-0 text-800 mt-0.5"
          aria-hidden="true"
        />
      )}
      <span>{getFaqLabel(row.label, language)}</span>
    </span>
  )
}

function highlightTone(value) {
  const normalized = String(value || '').trim().toLowerCase()
  if (['free', 'yes', 'مجاني', 'نعم'].includes(normalized)) return 'positive'
  if (['chargeable', 'لقاء رسوم'].includes(normalized)) return 'fee'
  if (['discounted', 'مخفّض'].includes(normalized)) return 'discount'
  if (/usd|\$|\d/.test(normalized)) return 'value'
  return 'neutral'
}

const highlightClass = {
  positive: 'bg-green/15 text-green',
  fee: 'bg-secondary-100 text-700',
  discount: 'bg-primary-1/15 text-primary-1',
  value: 'bg-primary-1/12 text-primary-1',
  neutral: 'bg-100 text-800',
}

const FareCell = ({ value, language }) => {
  if (!value) return null

  const highlight = getFaqLabel(value.highlight, language)
  const detail = getFaqLabel(value.detail, language)
  const notes = value.notes.map((note) => getFaqLabel(note, language)).filter(Boolean)
  const tone = highlightTone(highlight)

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {highlight && (
        <p
          dir={/\d/.test(highlight) ? 'ltr' : undefined}
          className={`${typography.caption} font-semibold m-0 w-fit max-w-full rounded-full px-2.5 py-1 break-words ${highlightClass[tone]}`}
        >
          {highlight}
        </p>
      )}
      {detail && (
        <p className={`${typography.caption} text-600 m-0 leading-relaxed break-words`}>{detail}</p>
      )}
      {notes.length > 0 && (
        <ul className="list-disc ps-4 m-0 flex flex-col gap-1.5">
          {notes.map((note) => (
            <li key={note} className={`${typography.caption} text-600 leading-relaxed break-words`}>
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const FareCards = ({ table, language }) => (
  <div className="flex flex-col gap-3 w-full px-4 sm:px-8 md:hidden">
    {table.columns.map((column) => (
      <article
        key={column.id}
        className="rounded-2xl border border-200 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
      >
        <header className="bg-primary-1 px-4 py-3.5">
          <p className={`${typography.caption} font-medium m-0 text-primary-100`}>
            {getFaqLabel(column.className, language)}
          </p>
          <p className={`${typography.itemTitle} font-bold text-50 m-0 mt-0.5`}>
            {getFaqLabel(column.name, language)}
          </p>
        </header>
        <div>
          {table.rows.map((row, index) => (
            <div
              key={row.id}
              className={`px-4 py-3.5 flex flex-col gap-2 ${
                index > 0 ? 'border-t border-200' : ''
              } ${index % 2 === 0 ? 'bg-background' : 'bg-100/70'}`}
            >
              <p className={`${typography.caption} font-semibold text-800 m-0`}>
                <FareRowLabel row={row} language={language} />
              </p>
              <FareCell value={row.cells[column.id]} language={language} />
            </div>
          ))}
        </div>
      </article>
    ))}
  </div>
)

const FareTable = ({ table, language }) => {
  const title = getFaqLabel(table.title, language)

  return (
    <div className="hidden md:block w-full border-y border-200 overflow-hidden">
      <table className="w-full table-fixed border-separate border-spacing-0 text-start">
        <caption className="sr-only">{title}</caption>
        <colgroup>
          <col className="w-[22%]" />
          {table.columns.map((column) => (
            <col key={column.id} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th
              scope="col"
              className={`${typography.caption} font-semibold text-50 bg-primary-1 px-3 py-3.5 lg:px-4`}
            >
              {getFaqLabel(table.featureLabel, language)}
            </th>
            {table.columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`${typography.caption} font-semibold text-50 bg-primary-1 px-3 py-3.5 lg:px-4`}
              >
                <span className="block font-medium text-primary-100">
                  {getFaqLabel(column.className, language)}
                </span>
                <span className={`${typography.body} block mt-1 font-bold tracking-wide break-words`}>
                  {getFaqLabel(column.name, language)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, index) => {
            const zebra = index % 2 === 0 ? 'bg-background' : 'bg-100/70'

            return (
              <tr key={row.id} className={`${zebra} hover:bg-primary-1/6 transition-colors`}>
                <th
                  scope="row"
                  className={`${typography.caption} font-semibold text-800 px-3 py-3.5 lg:px-4 align-top border-t border-200 ${zebra}`}
                >
                  <FareRowLabel row={row} language={language} />
                </th>
                {table.columns.map((column) => (
                  <td
                    key={column.id}
                    className="px-3 py-3.5 lg:px-4 border-t border-s border-200 align-top"
                  >
                    <FareCell value={row.cells[column.id]} language={language} />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const FareComparisonTables = ({ language }) => {
  const table = fareComparisonTables[0]

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <p className={`${typography.caption} font-medium text-600 m-0 px-4 sm:px-8 md:px-10`}>
        {getFaqLabel(table.title, language)}
      </p>
      <FareCards table={table} language={language} />
      <FareTable table={table} language={language} />
    </div>
  )
}

export default FareComparisonTables
