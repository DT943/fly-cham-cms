import { CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const FaqCategoryNav = ({ categories, expandedId, topicId, onSelectCategory, onSelectTopic }) => {
  const { t } = useTranslation()

  return (
    <nav
      aria-label={t('faq.explorer.navLabel')}
      className="bg-background rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-2 h-fit lg:sticky lg:top-6"
    >
      <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
        {categories.map((category) => {
          const Icon = category.icon
          const hasTopics = category.topics.length > 0
          const isExpanded = expandedId === category.id
          const isActiveCategory =
            topicId === category.id || category.topics.some((topic) => topic.id === topicId)

          return (
            <li
              key={category.id}
              className={`rounded-xl overflow-hidden ${
                isExpanded || (isActiveCategory && !hasTopics) ? 'bg-primary-1/10' : 'bg-transparent'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-none cursor-pointer text-start bg-transparent"
              >
                <Icon size={22} weight="regular" className="shrink-0 text-800" />
                <span className={`${typography.body} font-medium text-800 flex-1 min-w-0`}>
                  {t(`faq.categories.${category.id}.title`)}
                </span>
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`shrink-0 text-700 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {hasTopics && isExpanded && (
                <ul className="list-none m-0 p-0 pb-3 flex flex-col bg-primary-1/5">
                  {category.topics.map((topic) => {
                    const isActiveTopic = topic.id === topicId

                    return (
                      <li key={topic.id}>
                        <button
                          type="button"
                          onClick={() => onSelectTopic(category.id, topic.id, topic.questionIds)}
                          className={`${typography.caption} w-full bg-transparent border-none cursor-pointer text-start ps-12 pe-4 py-2 ${
                            isActiveTopic ? 'text-primary-1 font-semibold' : 'text-600 font-medium hover:text-primary-1'
                          }`}
                        >
                          {t(`faq.categories.${category.id}.topics.${topic.id}`)}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default FaqCategoryNav
