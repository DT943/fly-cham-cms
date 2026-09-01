import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { faqQuestionImages, getFaqLabel, groupFaqQuestions } from '../utils/faqCategories.js'
import FaqAccordionItem from './FaqAccordionItem.jsx'

const FaqTopicPanel = ({
  category,
  topic,
  questions,
  openIds,
  allOpen,
  onToggleQuestion,
  onToggleAll,
}) => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()
  const categoryTitle = getFaqLabel(category.title, language)
  const topicTitle = topic ? getFaqLabel(topic.title, language) : categoryTitle
  const groups = groupFaqQuestions(questions, topic?.title)

  return (
    <section className="bg-background rounded-xl border border-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-5 py-6 sm:px-8 md:px-10 md:py-8 flex-1 min-w-0">
      <div className="flex flex-col">
        <div className="flex flex-col gap-1 pb-5 border-b border-200">
          {topic && topic.id !== category.id && (
            <p className={`${typography.caption} text-600 m-0`}>
              {categoryTitle}
            </p>
          )}
          <div className="flex items-center justify-between gap-4 min-w-0">
            <h2 className={`${typography.sectionTitle} font-bold text-800 m-0`}>
              {topicTitle}
            </h2>
            {questions.length > 0 && (
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

        {questions.length === 0 ? (
          <p className={`${typography.body} text-600 m-0 pt-5`}>
            {t('faq.explorer.empty')}
          </p>
        ) : (
          <div>
            {groups.map((group) => (
              <div key={group.questions[0].id}>
                {group.showHeading && (
                  <p className={`${typography.caption} font-semibold text-600 m-0 pt-5 pb-1`}>
                    {getFaqLabel(group.branch, language)}
                  </p>
                )}
                {group.questions.map((question) => {
                  const image = faqQuestionImages[question.id]

                  return (
                    <FaqAccordionItem
                      key={question.id}
                      question={getFaqLabel(question.question, language)}
                      answer={getFaqLabel(question.answer, language)}
                      image={image?.src}
                      imageAlt={getFaqLabel(image?.alt, language)}
                      open={openIds.includes(question.id)}
                      onToggle={() => onToggleQuestion(question.id)}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FaqTopicPanel
