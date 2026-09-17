import { useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { getIssuesForYear, magazineYears } from '../utils/magazineIssues.js'
import MagazineIssueCard from './MagazineIssueCard.jsx'

/**
 * White panel listing the magazine issues for the selected year. The year
 * dropdown filters the grid; the section heading echoes the active year.
 */
const ExploreMarhaba = () => {
  const { t } = useTranslation()
  const [year, setYear] = useState(magazineYears[0])
  const issues = getIssuesForYear(year)

  return (
    <section className="flex flex-col gap-7 rounded-xl bg-50 p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle} lg:text-[28px]`}>
          {t('travelerMagazine.explore.title')}
        </h2>

        <label className="relative shrink-0">
          <span className="sr-only">{t('travelerMagazine.explore.yearLabel')}</span>
          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="w-[154px] cursor-pointer appearance-none rounded-lg border border-500 bg-50 px-4 py-3 font-semibold text-700 focus:border-primary-1 focus:outline-none"
          >
            {magazineYears.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <CaretDown
            size={16}
            weight="bold"
            className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-700"
            aria-hidden
          />
        </label>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className={`m-0 font-semibold text-primary-1 ${typography.itemTitle} lg:text-xl`}>
          {year}
        </h3>

        <ul className="m-0 grid list-none grid-cols-2 gap-4.5 p-0 md:grid-cols-3">
          {issues.map((issue) => (
            <li key={issue.id}>
              <MagazineIssueCard
                issue={issue.issue}
                month={t(`travelerMagazine.months.${issue.month}`)}
                cover={issue.cover}
                isNew={issue.isNew}
                href={issue.href}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ExploreMarhaba
