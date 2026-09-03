import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { faqQuestionImages, getFaqLabel, groupFaqQuestions } from '../utils/faqCategories.js'
import {
  getQuestionsForMethodTab,
  getTopicMethodTabs,
} from '../utils/faqPaymentTabs.js'
import FaqAccordionItem from './FaqAccordionItem.jsx'
import FaqTabs from './FaqTabs.jsx'

const FaqTopicPanel = ({
  category,
  topic,
  questions,
  openIds,
  onToggleQuestion,
  onToggleAll,
  onFocusQuestion,
}) => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()
  const categoryTitle = getFaqLabel(category.title, language)
  const topicTitle = topic ? getFaqLabel(topic.title, language) : categoryTitle
  const methodTabs = getTopicMethodTabs(topic, questions, language)
  const [methodTabId, setMethodTabId] = useState(methodTabs[0]?.id)

  useEffect(() => {
    setMethodTabId(undefined)
  }, [topic?.id])

  const activeTabId = methodTabs.some((tab) => tab.id === methodTabId)
    ? methodTabId
    : methodTabs[0]?.id

  const visibleQuestions = activeTabId
    ? getQuestionsForMethodTab(questions, activeTabId)
    : questions
  const groups = groupFaqQuestions(visibleQuestions, topic?.title)
  const visibleIds = visibleQuestions.map((question) => question.id)
  const visibleAllOpen =
    visibleIds.length > 0 && visibleIds.every((id) => openIds.includes(id))

  const handleSelectTab = (id) => {
    setMethodTabId(id)
    const first = getQuestionsForMethodTab(questions, id)[0]
    onFocusQuestion?.(first?.id)
  }

  return (
    <section className="bg-background rounded-xl border border-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-5 py-6 sm:px-8 md:px-10 md:py-8 flex-1 min-w-0">
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 pb-5 border-b border-200">
          <div className="flex flex-col gap-1">
            {topic && topic.id !== category.id && (
              <p className={`${typography.caption} text-600 m-0`}>
                {categoryTitle}
              </p>
            )}
            <div className="flex items-center justify-between gap-4 min-w-0">
              <h2 className={`${typography.sectionTitle} font-bold text-800 m-0`}>
                {topicTitle}
              </h2>
              {visibleQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => onToggleAll(visibleIds)}
                  className={`${typography.caption} font-medium text-primary-1 bg-transparent border-none cursor-pointer p-0 shrink-0`}
                >
                  {visibleAllOpen ? t('faq.explorer.closeAll') : t('faq.explorer.openAll')}
                </button>
              )}
            </div>
          </div>
          {methodTabs.length > 0 && (
            <FaqTabs
              tabs={methodTabs}
              activeId={activeTabId}
              onSelect={handleSelectTab}
              label={topicTitle}
            />
          )}
        </div>

        {visibleQuestions.length === 0 ? (
          <p className={`${typography.body} text-600 m-0 pt-5`}>
            {t('faq.explorer.empty')}
          </p>
        ) : (
          <div>
            {groups.map((group) => (
              <div key={group.questions[0].id}>
                {group.showHeading && !methodTabs.length && (
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
