import { useState } from 'react'
import { faqCategories, findFaqCategory, findFaqTopic } from '../utils/faqCategories.js'

const defaultCategory = faqCategories[0]
const defaultTopicId = defaultCategory.topics[0]?.id || defaultCategory.id

const useFaqExplorer = () => {
  const [expandedId, setExpandedId] = useState(defaultCategory.id)
  const [topicId, setTopicId] = useState(defaultTopicId)
  const [openIds, setOpenIds] = useState(['bookingNumber'])

  const category = findFaqCategory(faqCategories, topicId)
  const topic = findFaqTopic(category, topicId)
  const questionIds = topic?.questionIds || []
  const allOpen = questionIds.length > 0 && questionIds.every((id) => openIds.includes(id))

  const selectCategory = (id) => {
    const next = faqCategories.find((item) => item.id === id)
    if (!next) return

    if (expandedId === id) {
      setExpandedId(null)
      return
    }

    setExpandedId(id)

    if (next.topics.length > 0) {
      const firstTopic = next.topics[0]
      setTopicId(firstTopic.id)
      setOpenIds(firstTopic.questionIds.slice(0, 1))
      return
    }

    setTopicId(id)
    setOpenIds([])
  }

  const selectTopic = (categoryId, nextTopicId, nextQuestionIds = []) => {
    setExpandedId(categoryId)
    setTopicId(nextTopicId)
    setOpenIds(nextQuestionIds.slice(0, 1))
  }

  const toggleQuestion = (id) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    )
  }

  const toggleAll = () => {
    setOpenIds(allOpen ? [] : [...questionIds])
  }

  return {
    categories: faqCategories,
    expandedId,
    topicId,
    category,
    topic,
    questionIds,
    openIds,
    allOpen,
    selectCategory,
    selectTopic,
    toggleQuestion,
    toggleAll,
  }
}

export default useFaqExplorer
