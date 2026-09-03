import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  faqCategories,
  findFaqCategory,
  findFaqQuestionLocation,
  findFaqTopic,
} from '../utils/faqCategories.js'

const defaultCategory = faqCategories[0]
const defaultTopic = defaultCategory.topics[0] || null
const defaultTopicId = defaultTopic?.id || defaultCategory.id
const defaultQuestionIds = defaultTopic?.questions?.map((question) => question.id) || []

function getExplorerStateFromQuestion(questionId) {
  const location = findFaqQuestionLocation(questionId)
  if (!location) return null

  return {
    expandedId: location.category.id,
    topicId: location.topic.id,
    openIds: [location.question.id],
  }
}

const useFaqExplorer = () => {
  const [searchParams] = useSearchParams()
  const questionParam = searchParams.get('question')
  const fromSearch = getExplorerStateFromQuestion(questionParam)

  const [expandedId, setExpandedId] = useState(fromSearch?.expandedId ?? defaultCategory.id)
  const [topicId, setTopicId] = useState(fromSearch?.topicId ?? defaultTopicId)
  const [openIds, setOpenIds] = useState(fromSearch?.openIds ?? defaultQuestionIds.slice(0, 1))

  useEffect(() => {
    const next = getExplorerStateFromQuestion(questionParam)
    if (!next) return

    setExpandedId(next.expandedId)
    setTopicId(next.topicId)
    setOpenIds(next.openIds)
  }, [questionParam])

  const category = findFaqCategory(faqCategories, topicId)
  const topic = findFaqTopic(category, topicId)
  const questions = topic?.questions || []
  const questionIds = questions.map((question) => question.id)

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

  const toggleAll = (ids = questionIds) => {
    const list = ids.length ? ids : questionIds
    const everyOpen = list.length > 0 && list.every((id) => openIds.includes(id))
    setOpenIds((current) =>
      everyOpen ? current.filter((id) => !list.includes(id)) : [...new Set([...current, ...list])]
    )
  }

  const focusQuestion = (id) => {
    setOpenIds(id ? [id] : [])
  }

  return {
    categories: faqCategories,
    expandedId,
    topicId,
    category,
    topic,
    questions,
    openIds,
    focusQuestionId: questionParam,
    selectCategory,
    selectTopic,
    toggleQuestion,
    toggleAll,
    focusQuestion,
  }
}

export default useFaqExplorer
