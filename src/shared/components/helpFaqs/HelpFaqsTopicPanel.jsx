import { useEffect, useState } from 'react'
import { typography } from '../../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../../styles/cmsStyle.js'
import LinkedText from '../backlinks/LinkedText.jsx'
import { searchHitId } from '../../search/utils/searchHit.js'
import HelpFaqsAccordionItem from './HelpFaqsAccordionItem.jsx'
import HelpFaqsTabs from './HelpFaqsTabs.jsx'
import { getHelpFaqsTable } from './tables.jsx'

function groupQuestions(questions, topicTitle) {
  const groups = []

  questions.forEach((question) => {
    const last = groups[groups.length - 1]
    if (last && last.branch === (question.branch || '')) {
      last.questions.push(question)
      return
    }

    groups.push({ branch: question.branch || '', questions: [question] })
  })

  const showHeadings = groups.length > 1

  return groups.map((group) => ({
    ...group,
    showHeading: showHeadings && group.branch && group.branch !== topicTitle,
  }))
}

function getQuestionsForMethodTab(questions, tabId) {
  if (!tabId) return questions
  return questions.filter((question) => (question.methodTab || 'channels') === tabId)
}

const HelpFaqsTopicPanel = ({
  category,
  topic,
  questions,
  openIds,
  onToggleQuestion,
  onToggleAll,
  onFocusQuestion,
  focusQuestionId,
  openAll = '',
  closeAll = '',
  empty = '',
  language = 'en',
  links = [],
  showLinks = true,
  style = {},
}) => {
  const categoryTitle = category?.title || ''
  const topicTitle = topic?.title || categoryTitle
  const methodTabs = Array.isArray(topic?.methodTabs)
    ? topic.methodTabs.filter((tab) => tab.id && tab.title)
    : []
  const focusedQuestion = questions.find((question) => question.id === focusQuestionId)
  const focusedTabId = focusedQuestion?.methodTab || undefined
  const [methodTabId, setMethodTabId] = useState(focusedTabId)

  useEffect(() => {
    setMethodTabId(focusedTabId)
  }, [topic?.id, focusedTabId])

  const activeTabId = methodTabs.some((tab) => tab.id === methodTabId)
    ? methodTabId
    : methodTabs[0]?.id

  const visibleQuestions = activeTabId
    ? getQuestionsForMethodTab(questions, activeTabId)
    : questions
  const groups = groupQuestions(visibleQuestions, topic?.title || '')
  const visibleIds = visibleQuestions.map((question) => question.id)
  const visibleAllOpen =
    visibleIds.length > 0 && visibleIds.every((id) => openIds.includes(id))

  const handleSelectTab = (id) => {
    setMethodTabId(id)
    const first = getQuestionsForMethodTab(questions, id)[0]
    onFocusQuestion?.(first?.id)
  }

  return (
    <section className="bg-background rounded-xl border border-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] py-5 sm:py-6 md:py-8 overflow-hidden flex-1 min-w-0 scroll-mt-28">
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 px-4 sm:px-8 md:px-10 pb-5 border-b border-200">
          <div className="flex flex-col gap-1">
            {topic && topic.id !== category?.id && (
              <p className={`${typography.caption} text-600 m-0`}>{categoryTitle}</p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 min-w-0">
              <h2
                className={`${typography.sectionTitle} ${CMS_TEXT_HOVER_CLASS} font-bold m-0 min-w-0`}
                style={getTextStyleVars(style, 'titleColor', '800')}
              >
                <LinkedText
                  text={topicTitle}
                  links={links}
                  style={style}
                  enabled={showLinks}
                />
              </h2>
              {visibleQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => onToggleAll(visibleIds)}
                  className={`${typography.caption} font-medium text-primary-1 bg-transparent border-none cursor-pointer p-0 shrink-0 self-start`}
                >
                  {visibleAllOpen ? closeAll : openAll}
                </button>
              )}
            </div>
          </div>
          {methodTabs.length > 0 && (
            <HelpFaqsTabs
              tabs={methodTabs}
              activeId={activeTabId}
              onSelect={handleSelectTab}
              label={topicTitle}
            />
          )}
        </div>

        {visibleQuestions.length === 0 ? (
          <p className={`${typography.body} text-600 m-0 px-4 sm:px-8 md:px-10 pt-5`}>
            {empty}
          </p>
        ) : (
          <div>
            {groups.map((group) => (
              <div key={group.questions[0].id || group.branch}>
                {group.showHeading && !methodTabs.length && (
                  <p
                    className={`${typography.caption} font-semibold text-600 m-0 px-4 sm:px-8 md:px-10 pt-5 pb-1`}
                  >
                    {group.branch}
                  </p>
                )}
                {group.questions.map((question) => {
                  const Extra = getHelpFaqsTable(question.extra)

                  return (
                    <HelpFaqsAccordionItem
                      key={question.id}
                      id={searchHitId(question.id)}
                      question={question.question}
                      answer={Extra ? '' : question.answer}
                      extra={Extra ? <Extra language={language} /> : null}
                      open={openIds.includes(question.id)}
                      onToggle={() => onToggleQuestion(question.id)}
                      links={links}
                      showLinks={showLinks}
                      style={style}
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

export default HelpFaqsTopicPanel
