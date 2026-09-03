import { CaretDown } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { getFaqLabel, hasNestedTopics } from '../utils/faqCategories.js'

const FaqCategoryNav = ({ categories, expandedId, topicId, onSelectCategory, onSelectTopic }) => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()

  return (
    <nav
      aria-label={t('faq.explorer.navLabel')}
      className="bg-background rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden h-fit lg:sticky lg:top-6"
    >
      <ul className="list-none m-0 p-0 flex flex-col">
        {categories.map((category) => {
          const Icon = category.icon
          const nestedTopics = hasNestedTopics(category)
          const isExpanded = expandedId === category.id
          const isActiveCategory =
            topicId === category.id || category.topics.some((topic) => topic.id === topicId)

          return (
            <li
              key={category.id}
              className={`overflow-hidden ${
                isExpanded || (isActiveCategory && !nestedTopics) ? 'bg-primary-100/30' : 'bg-transparent'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-none cursor-pointer text-start ${
                  isExpanded || (isActiveCategory && !nestedTopics)
                    ? 'bg-primary-100/55'
                    : 'bg-transparent'
                }`}
              >
                <Icon size={22} weight="regular" className="shrink-0 text-800" />
                <span className={`${typography.body} font-medium text-800 flex-1 min-w-0`}>
                  {getFaqLabel(category.title, language)}
                </span>
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`shrink-0 text-700 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {nestedTopics && isExpanded && (
                <ul className="list-none m-0 p-0 pb-3 pt-1 flex flex-col">
                  {category.topics.map((topic) => {
                    const isActiveTopic = topic.id === topicId

                    return (
                      <li key={topic.id}>
                        <button
                          type="button"
                          onClick={() => onSelectTopic(category.id, topic.id, topic.questions)}
                          className={`${typography.caption} w-full bg-transparent border-none cursor-pointer text-start ps-12 pe-4 py-2 ${
                            isActiveTopic
                              ? 'text-primary-1 font-bold'
                              : 'text-800 font-normal hover:text-primary-1'
                          }`}
                        >
                          {getFaqLabel(topic.title, language)}
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
