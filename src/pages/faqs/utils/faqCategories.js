import faqPh1 from '../../../assets/images/faq/ph1.png'
import { faqCategories as faqContent } from './faqData.js'
import {
  AirTrafficControl,
  ArrowsClockwise,
  CalendarBlank,
  CalendarX,
  Handshake,
  Headset,
  Package,
  PawPrint,
  Plugs,
  SealQuestion,
  Seat,
  Ticket,
  TrolleySuitcase,
  UserCheck,
} from '@phosphor-icons/react'

const categoryIcons = {
  booking: Ticket,
  modifications: ArrowsClockwise,
  cancellationsAndRefunds: CalendarX,
  baggage: TrolleySuitcase,
  flightSchedules: CalendarBlank,
  beforeTravel: UserCheck,
  atTheAirport: AirTrafficControl,
  onboard: Seat,
  travelInformation: SealQuestion,
  petTravel: PawPrint,
  support: Headset,
  cargo: Package,
  becomeAPartner: Handshake,
  partnerships: Plugs,
}

export const faqCategories = faqContent.map((category) => ({
  ...category,
  icon: categoryIcons[category.id] || SealQuestion,
}))

export const faqQuestionImages = {
  'booking-bookingOnline-1': {
    src: faqPh1,
    alt: {
      en: 'Passenger holding a smartphone with a digital boarding pass',
      ar: 'مسافر يمسك هاتفاً ذكياً يعرض بطاقة صعود رقمية',
    },
  },
}

export function getFaqLabel(value, language) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[language] || value.en || ''
}

export function hasNestedTopics(category) {
  return category.topics.some((topic) => topic.id !== category.id)
}

export function findFaqCategory(categories, topicId) {
  return (
    categories.find((category) =>
      category.topics.some((topic) => topic.id === topicId)
    ) || categories.find((category) => category.id === topicId) || categories[0]
  )
}

export function findFaqTopic(category, topicId) {
  return category.topics.find((topic) => topic.id === topicId) || category.topics[0] || null
}

export function findFaqQuestionLocation(questionId) {
  if (!questionId) return null

  for (const category of faqCategories) {
    for (const topic of category.topics) {
      const question = topic.questions.find((item) => item.id === questionId)
      if (question) return { category, topic, question }
    }
  }

  return null
}

export function groupFaqQuestions(questions, topicTitle) {
  const groups = []

  questions.forEach((question) => {
    const last = groups[groups.length - 1]
    if (last && getFaqLabel(last.branch, 'en') === getFaqLabel(question.branch, 'en')) {
      last.questions.push(question)
      return
    }

    groups.push({ branch: question.branch, questions: [question] })
  })

  const showHeadings = groups.length > 1

  return groups.map((group) => ({
    ...group,
    showHeading: showHeadings && getFaqLabel(group.branch, 'en') !== getFaqLabel(topicTitle, 'en'),
  }))
}
