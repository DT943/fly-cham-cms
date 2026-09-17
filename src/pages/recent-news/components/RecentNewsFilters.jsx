import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import Dropdown from '../../../shared/components/Dropdown.jsx'
import { recentNewsMonths, recentNewsTopics, recentNewsYears } from '../utils/recentNews.js'

const RecentNewsFilters = ({ activeTopic, onTopicChange }) => {
  const { t } = useTranslation()
  const [month, setMonth] = useState('all')
  const [year, setYear] = useState('all')

  return (
    <section className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <span className={`shrink-0 font-medium text-700 ${typography.body}`}>
          {t('recentNews.filters.label')}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Dropdown
            label={t('recentNews.filters.monthLabel')}
            value={month}
            onChange={setMonth}
            options={recentNewsMonths.map((id) => ({
              value: id,
              label: t(`recentNews.filters.months.${id}`),
            }))}
            className="min-w-0 flex-1"
          />

          <Dropdown
            label={t('recentNews.filters.yearLabel')}
            value={year}
            onChange={setYear}
            options={recentNewsYears.map((id) => ({
              value: id,
              label: t(`recentNews.filters.years.${id}`),
            }))}
            className="min-w-0 flex-1"
          />
        </div>

        <button
          type="button"
          className={`h-12 w-full shrink-0 cursor-pointer rounded-lg border-0 bg-secondary px-10 font-semibold text-btn transition-colors hover:bg-secondary-800 md:w-auto md:min-w-[7.5rem] ${typography.button}`}
        >
          {t('recentNews.filters.search')}
        </button>
      </div>

      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-3">
        {recentNewsTopics.map((topic) => {
          const isActive = topic === activeTopic

          return (
            <button
              key={topic}
              type="button"
              aria-pressed={isActive}
              onClick={() => onTopicChange(topic)}
              className={`shrink-0 cursor-pointer rounded-lg border-0 px-4 py-2.5 font-medium transition-colors md:px-5 md:py-3 ${typography.caption} ${
                isActive
                  ? 'bg-primary-1 text-50'
                  : 'bg-200 text-primary-1 hover:bg-200/80'
              }`}
            >
              {t(`recentNews.topics.${topic}`)}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default RecentNewsFilters
