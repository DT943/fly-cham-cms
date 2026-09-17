import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import Dropdown from '../../../shared/components/Dropdown.jsx'
import { getIssuesForYear, magazineYears, MAGAZINE_VIEW_HREF } from '../utils/magazineIssues.js'
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

        <Dropdown
          label={t('travelerMagazine.explore.yearLabel')}
          value={year}
          onChange={setYear}
          options={magazineYears.map((option) => ({
            value: option,
            label: String(option),
          }))}
          className="w-[154px] shrink-0"
        />
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
                href={MAGAZINE_VIEW_HREF}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ExploreMarhaba
