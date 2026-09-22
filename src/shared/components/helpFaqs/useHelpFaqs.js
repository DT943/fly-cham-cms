import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

function findQuestionLocation(categories, questionId) {
  if (!questionId) return null

  for (const category of categories) {
    for (const topic of category.topics || []) {
      const question = (topic.questions || []).find((item) => item.id === questionId)
      if (question) return { category, topic, question }
    }
  }

  return null
}

function findCategory(categories, topicId) {
  return (
    categories.find((category) =>
      (category.topics || []).some((topic) => topic.id === topicId),
    ) ||
    categories.find((category) => category.id === topicId) ||
    categories[0]
  )
}

function findTopic(category, topicId) {
  const topics = category?.topics || []
  return topics.find((topic) => topic.id === topicId) || topics[0] || null
}

function hasNestedTopics(category) {
  return (category?.topics || []).some((topic) => topic.id !== category.id)
}

function stateFromQuestion(categories, questionId) {
  const location = findQuestionLocation(categories, questionId)
  if (!location) return null

  return {
    expandedId: location.category.id,
    topicId: location.topic.id,
    openIds: [location.question.id],
  }
}

export default function useHelpFaqs(categories = []) {
  const [searchParams] = useSearchParams()
  const questionParam = searchParams.get('question')
  const fromSearch = useMemo(
    () => stateFromQuestion(categories, questionParam),
    [categories, questionParam],
  )

  const defaultCategory = categories[0]
  const defaultTopic = defaultCategory?.topics?.[0] || null
  const defaultTopicId = defaultTopic?.id || defaultCategory?.id || ''
  const defaultQuestionIds = defaultTopic?.questions?.map((question) => question.id) || []

  const [expandedId, setExpandedId] = useState(
    fromSearch?.expandedId ?? defaultCategory?.id ?? '',
  )
  const [topicId, setTopicId] = useState(fromSearch?.topicId ?? defaultTopicId)
  const [openIds, setOpenIds] = useState(
    fromSearch?.openIds ?? defaultQuestionIds.slice(0, 1),
  )

  useEffect(() => {
    if (!categories.length) return
    const stillValid = categories.some((category) =>
      (category.topics || []).some((topic) => topic.id === topicId),
    )
    if (stillValid) return

    const nextCategory = categories[0]
    const nextTopic = nextCategory?.topics?.[0]
    setExpandedId(nextCategory?.id || '')
    setTopicId(nextTopic?.id || nextCategory?.id || '')
    setOpenIds((nextTopic?.questions || []).slice(0, 1).map((question) => question.id))
  }, [categories, topicId])

  useEffect(() => {
    const next = stateFromQuestion(categories, questionParam)
    if (!next) return

    setExpandedId(next.expandedId)
    setTopicId(next.topicId)
    setOpenIds(next.openIds)
  }, [categories, questionParam])

  const category = findCategory(categories, topicId) || defaultCategory || null
  const topic = findTopic(category, topicId)
  const questions = topic?.questions || []
  const questionIds = questions.map((question) => question.id)

  const selectCategory = (id) => {
    const next = categories.find((item) => item.id === id)
    if (!next) return

    if (expandedId === id) {
      setExpandedId(null)
      return
    }

    setExpandedId(id)

    const firstTopic = next.topics?.[0]
    if (firstTopic) {
      setTopicId(firstTopic.id)
      setOpenIds((firstTopic.questions || []).slice(0, 1).map((question) => question.id))
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
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const toggleAll = (ids = questionIds) => {
    const list = ids.length ? ids : questionIds
    const everyOpen = list.length > 0 && list.every((id) => openIds.includes(id))
    setOpenIds((current) =>
      everyOpen ? current.filter((id) => !list.includes(id)) : [...new Set([...current, ...list])],
    )
  }

  const focusQuestion = (id) => {
    setOpenIds(id ? [id] : [])
  }

  return {
    categories,
    expandedId,
    topicId,
    category,
    topic,
    questions,
    openIds,
    focusQuestionId: questionParam,
    hasNestedTopics,
    selectCategory,
    selectTopic,
    toggleQuestion,
    toggleAll,
    focusQuestion,
  }
}
