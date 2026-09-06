import { useState } from 'react'
import { typography } from '../../../styles/typography.js'
import { getFaqLabel } from '../utils/faqCategories.js'
import {
  fareComparisonTables,
  fareComparisonTabsLabel,
} from '../utils/fareComparison.js'
import FaqTabs from './FaqTabs.jsx'

const FareCell = ({ value, language }) => {
  if (!value) return null

  const highlight = getFaqLabel(value.highlight, language)
  const detail = getFaqLabel(value.detail, language)
  const notes = value.notes.map((note) => getFaqLabel(note, language)).filter(Boolean)

  return (
    <div className="flex flex-col gap-1.5">
      {highlight && (
        <p
          dir={/\d/.test(highlight) ? 'ltr' : undefined}
          className={`${typography.itemTitle} font-semibold text-800 m-0`}
        >
          {highlight}
        </p>
      )}
      {detail && (
        <p className={`${typography.caption} text-600 m-0 leading-relaxed`}>{detail}</p>
      )}
      {notes.length > 0 && (
        <ul className="list-disc ps-4 m-0 flex flex-col gap-1">
          {notes.map((note) => (
            <li key={note} className={`${typography.caption} text-600 leading-relaxed`}>
              {note}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const FareTable = ({ table, language }) => {
  const title = getFaqLabel(table.title, language)
  const minWidth = table.columns.length > 1 ? 'min-w-[52rem]' : 'min-w-[28rem]'

  return (
    <div className="flex flex-col gap-3">
      <h4 className={`${typography.itemTitle} font-semibold text-800 m-0`}>{title}</h4>
      <div className="overflow-x-auto overscroll-x-contain rounded-xl border border-200">
        <table className={`w-full ${minWidth} border-collapse text-start`}>
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="bg-100">
              <th
                scope="col"
                className={`${typography.caption} font-semibold text-700 sticky start-0 z-10 bg-100 px-3 py-3 md:px-4 border-e border-200 w-40 md:w-52`}
              >
                {getFaqLabel(table.featureLabel, language)}
              </th>
              {table.columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`${typography.caption} font-semibold text-800 px-3 py-3 md:px-4 border-e border-200 last:border-e-0`}
                >
                  <span className="block text-600 font-medium">
                    {getFaqLabel(column.className, language)}
                  </span>
                  <span className="block mt-0.5">{getFaqLabel(column.name, language)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'bg-background' : 'bg-50'}>
                <th
                  scope="row"
                  className={`${typography.caption} font-semibold text-800 sticky start-0 z-10 px-3 py-3 md:px-4 border-t border-e border-200 align-top ${
                    index % 2 === 0 ? 'bg-background' : 'bg-50'
                  }`}
                >
                  {getFaqLabel(row.label, language)}
                </th>
                {table.columns.map((column) => (
                  <td
                    key={column.id}
                    className="px-3 py-3 md:px-4 border-t border-e border-200 last:border-e-0 align-top"
                  >
                    <FareCell value={row.cells[column.id]} language={language} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const FareComparisonTables = ({ language }) => {
  const [activeId, setActiveId] = useState(fareComparisonTables[0].id)
  const table = fareComparisonTables.find((item) => item.id === activeId) || fareComparisonTables[0]

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      <FaqTabs
        tabs={fareComparisonTables.map((item) => ({
          id: item.id,
          title: getFaqLabel(item.tab, language),
        }))}
        activeId={table.id}
        onSelect={setActiveId}
        label={getFaqLabel(fareComparisonTabsLabel, language)}
      />
      <FareTable table={table} language={language} />
    </div>
  )
}

export default FareComparisonTables
