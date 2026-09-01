import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { faqQuestionImages } from '../utils/faqCategories.js'
import FaqAccordionItem from './FaqAccordionItem.jsx'

const FaqTopicPanel = ({
  category,
  topic,
  questionIds,
  openIds,
  allOpen,
  onToggleQuestion,
  onToggleAll,
}) => {
  const { t } = useTranslation()
  const categoryTitle = t(`faq.categories.${category.id}.title`)
  const topicTitle = topic
    ? t(`faq.categories.${category.id}.topics.${topic.id}`)
    : categoryTitle

  return (
    <section className="bg-background rounded-xl border border-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-5 py-6 sm:px-8 md:px-10 md:py-8 flex-1 min-w-0">
      <div className="flex flex-col">
        <div className="flex flex-col gap-1 pb-5 border-b border-200">
          {topic && (
            <p className={`${typography.caption} text-600 m-0`}>
              {categoryTitle}
            </p>
          )}
          <div className="flex items-center justify-between gap-4 min-w-0">
            <h2 className={`${typography.sectionTitle} font-bold text-800 m-0`}>
              {topicTitle}
            </h2>
            {questionIds.length > 0 && (
              <button
                type="button"
                onClick={onToggleAll}
                className={`${typography.caption} font-medium text-primary-1 bg-transparent border-none cursor-pointer p-0 shrink-0`}
              >
                {allOpen ? t('faq.explorer.closeAll') : t('faq.explorer.openAll')}
              </button>
            )}
          </div>
        </div>

        {questionIds.length === 0 ? (
          <p className={`${typography.body} text-600 m-0 pt-5`}>
            {t('faq.explorer.empty')}
          </p>
        ) : (
          <div>
            {questionIds.map((id) => (
              <FaqAccordionItem
                key={id}
                question={t(`faq.questions.${id}.question`)}
                answer={t(`faq.questions.${id}.answer`, { defaultValue: '' })}
                image={faqQuestionImages[id]}
                imageAlt={t(`faq.questions.${id}.imageAlt`, { defaultValue: '' })}
                open={openIds.includes(id)}
                onToggle={() => onToggleQuestion(id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FaqTopicPanel
