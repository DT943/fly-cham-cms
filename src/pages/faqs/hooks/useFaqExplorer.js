import { useState } from 'react'
import { faqCategories, findFaqCategory, findFaqTopic } from '../utils/faqCategories.js'

const defaultCategory = faqCategories[0]
const defaultTopic = defaultCategory.topics[0] || null
const defaultTopicId = defaultTopic?.id || defaultCategory.id
const defaultQuestionIds = defaultTopic?.questions?.map((question) => question.id) || []

const useFaqExplorer = () => {
  const [expandedId, setExpandedId] = useState(defaultCategory.id)
  const [topicId, setTopicId] = useState(defaultTopicId)
  const [openIds, setOpenIds] = useState(defaultQuestionIds.slice(0, 1))

  const category = findFaqCategory(faqCategories, topicId)
  const topic = findFaqTopic(category, topicId)
  const questions = topic?.questions || []
  const questionIds = questions.map((question) => question.id)
  const allOpen = questionIds.length > 0 && questionIds.every((id) => openIds.includes(id))

  const selectCategory = (id) => {
    const next = faqCategories.find((item) => item.id === id)
    if (!next) return

    if (expandedId === id) {
      setExpandedId(null)
      return
    }

    setExpandedId(id)

    const firstTopic = next.topics[0]
    if (firstTopic) {
      setTopicId(firstTopic.id)
      setOpenIds(firstTopic.questions.slice(0, 1).map((question) => question.id))
      return
    }

    setTopicId(id)
    setOpenIds([])
  }

  const selectTopic = (categoryId, nextTopicId, nextQuestions = []) => {
    setExpandedId(categoryId)
    setTopicId(nextTopicId)
    setOpenIds(nextQuestions.slice(0, 1).map((question) => question.id))
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
    questions,
    openIds,
    allOpen,
    selectCategory,
    selectTopic,
    toggleQuestion,
    toggleAll,
  }
}

export default useFaqExplorer
