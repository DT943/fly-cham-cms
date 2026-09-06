import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { getFaqLabel } from '../utils/faqCategories.js'

const latinUnitPattern = /(USD\s*\d+|\d+\s*kg)/gi

function localizeHighlight(highlight, language) {
  if (language !== 'ar') return highlight

  return highlight
    .replace(/^(\d+)\s*kg$/i, '$1 كلغ')
    .replace(/^USD\s*(\d+)$/i, '$1 دولار')
}

function renderWithLatinUnits(text) {
  latinUnitPattern.lastIndex = 0
  if (!latinUnitPattern.test(text)) return text
  latinUnitPattern.lastIndex = 0

  return text.split(latinUnitPattern).map((part, index) =>
    /^(USD\s*\d+|\d+\s*kg)$/i.test(part) ? (
      <span key={`${part}-${index}`} dir="ltr" className="inline-block">
        {part}
      </span>
    ) : (
      part
    )
  )
}

const FareRowLabel = ({ row, language, icons }) => {
  const Icon = icons?.[row.id]

  return (
    <span className="flex items-start gap-2.5 min-w-0">
      {Icon && (
        <Icon
          size={20}
          weight="regular"
          className="shrink-0 text-current"
          aria-hidden="true"
        />
      )}
      <span className="leading-5 break-words">{getFaqLabel(row.label, language)}</span>
    </span>
  )
}

const FareCell = ({ value, language }) => {
  if (!value) return null

  const highlight = localizeHighlight(getFaqLabel(value.highlight, language), language)
  const detail = getFaqLabel(value.detail, language)
  const notes = value.notes.map((note) => getFaqLabel(note, language)).filter(Boolean)

  return (
    <div className="flex flex-col gap-1.5 min-w-0 text-start">
      {highlight && (
        <p className={`${typography.caption} font-semibold text-800 m-0 break-words`}>
          {renderWithLatinUnits(highlight)}
        </p>
      )}
      {detail && (
        <p className={`${typography.caption} text-600 m-0 leading-relaxed break-words`}>
          {renderWithLatinUnits(detail)}
        </p>
      )}
      {notes.length > 0 && (
        <ul className="list-disc ps-4 m-0 flex flex-col gap-1.5">
          {notes.map((note) => (
            <li key={note} className={`${typography.caption} text-600 leading-relaxed break-words`}>
              {renderWithLatinUnits(note)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const FareRow = ({ row, table, language, icons, open, onToggle, zebra }) => (
  <div className={`border-t border-200 ${zebra}`}>
    <h4 className="m-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`${typography.caption} font-semibold w-full bg-transparent border-0 flex items-center justify-between gap-3 cursor-pointer px-4 sm:px-8 md:px-10 py-3.5 text-start transition-colors duration-300 ease-in-out motion-reduce:transition-none ${
          open ? 'text-primary-1' : 'text-800'
        }`}
      >
        <FareRowLabel row={row} language={language} icons={icons} />
        <CaretDown
          size={16}
          weight="bold"
          className={`shrink-0 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
            open ? 'rotate-180 text-primary-1' : 'text-500'
          }`}
        />
      </button>
    </h4>
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden min-h-0">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 border-t border-200 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {table.columns.map((column) => (
            <div
              key={column.id}
              className="px-4 sm:px-8 md:px-6 lg:px-8 py-3.5 border-t border-200 md:border-t-0 md:border-s first:border-s-0 first:border-t-0"
            >
              <p className={`${typography.caption} font-semibold text-800 m-0 mb-1.5 md:hidden`}>
                {getFaqLabel(column.name, language)}
              </p>
              <FareCell value={row.cells[column.id]} language={language} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const FareInfoTable = ({ table, language, icons = {} }) => {
  const [openIds, setOpenIds] = useState(() => table.rows.map((row) => row.id))
  const intro = getFaqLabel(table.intro, language)
  const note = getFaqLabel(table.note, language)
  const title = getFaqLabel(table.title, language)

  const toggleRow = (id) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      {intro && (
        <p className={`${typography.itemDescription} text-600 m-0 px-4 sm:px-8 md:px-10 leading-relaxed`}>
          {intro}
        </p>
      )}
      {title && !intro && (
        <p className={`${typography.caption} font-medium text-600 m-0 px-4 sm:px-8 md:px-10`}>
          {title}
        </p>
      )}
      <div className="w-full border-y border-200">
        <div className="hidden md:grid grid-cols-3 bg-primary-1">
          {table.columns.map((column) => (
            <div
              key={column.id}
              className={`${typography.caption} font-semibold text-50 px-6 lg:px-8 py-3.5`}
            >
              <span className="block font-medium text-primary-100">
                {getFaqLabel(column.className, language)}
              </span>
              <span className={`${typography.body} block mt-1 font-bold tracking-wide break-words`}>
                {getFaqLabel(column.name, language)}
              </span>
            </div>
          ))}
        </div>
        {table.rows.map((row, index) => (
          <FareRow
            key={row.id}
            row={row}
            table={table}
            language={language}
            icons={icons}
            open={openIds.includes(row.id)}
            onToggle={() => toggleRow(row.id)}
            zebra={index % 2 === 0 ? 'bg-background' : 'bg-100/70'}
          />
        ))}
      </div>
      {note && (
        <p className={`${typography.caption} text-600 m-0 px-4 sm:px-8 md:px-10 leading-relaxed`}>
          {renderWithLatinUnits(note)}
        </p>
      )}
    </div>
  )
}

export default FareInfoTable
