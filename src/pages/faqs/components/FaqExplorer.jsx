import { useState } from 'react'
import useFaqExplorer from '../hooks/useFaqExplorer.js'
import { hasNestedTopics } from '../utils/faqCategories.js'
import FaqCategoryNav from './FaqCategoryNav.jsx'
import FaqTopicPanel from './FaqTopicPanel.jsx'

const FaqExplorer = () => {
  const {
    categories,
    expandedId,
    topicId,
    category,
    topic,
    questions,
    openIds,
    focusQuestionId,
    selectCategory,
    selectTopic,
    toggleQuestion,
    toggleAll,
    focusQuestion,
  } = useFaqExplorer()
  const [navOpen, setNavOpen] = useState(false)

  const closeMobileNav = () => setNavOpen(false)

  const handleSelectCategory = (id) => {
    const next = categories.find((item) => item.id === id)
    const collapsing = expandedId === id
    selectCategory(id)
    if (next && !hasNestedTopics(next) && !collapsing) closeMobileNav()
  }

  const handleSelectTopic = (categoryId, nextTopicId, nextQuestions = []) => {
    selectTopic(categoryId, nextTopicId, nextQuestions)
    closeMobileNav()
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 md:gap-5 items-stretch lg:items-start">
      <div className="w-full lg:w-72 xl:w-80 shrink-0">
        <FaqCategoryNav
          categories={categories}
          expandedId={expandedId}
          topicId={topicId}
          onSelectCategory={handleSelectCategory}
          onSelectTopic={handleSelectTopic}
          mobileOpen={navOpen}
          onToggleMobile={() => setNavOpen((open) => !open)}
        />
      </div>
      <FaqTopicPanel
        category={category}
        topic={topic}
        questions={questions}
        openIds={openIds}
        onToggleQuestion={toggleQuestion}
        onToggleAll={toggleAll}
        onFocusQuestion={focusQuestion}
        focusQuestionId={focusQuestionId}
      />
    </div>
  )
}

export default FaqExplorer
