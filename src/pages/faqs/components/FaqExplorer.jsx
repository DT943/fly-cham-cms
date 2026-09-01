import useFaqExplorer from '../hooks/useFaqExplorer.js'
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
    allOpen,
    selectCategory,
    selectTopic,
    toggleQuestion,
    toggleAll,
  } = useFaqExplorer()

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-5 items-start">
      <div className="w-full lg:w-72 xl:w-80 shrink-0">
        <FaqCategoryNav
          categories={categories}
          expandedId={expandedId}
          topicId={topicId}
          onSelectCategory={selectCategory}
          onSelectTopic={selectTopic}
        />
      </div>
      <FaqTopicPanel
        category={category}
        topic={topic}
        questions={questions}
        openIds={openIds}
        allOpen={allOpen}
        onToggleQuestion={toggleQuestion}
        onToggleAll={toggleAll}
      />
    </div>
  )
}

export default FaqExplorer
