import { getFaqLabel } from './faqCategories.js'

export const PAYMENT_METHOD_TOPIC_ID = 'beforeTravel-paymentMethods'

const paymentMethodTabs = [
  { id: 'channels', title: { en: 'Channels', ar: 'القنوات' } },
  { id: 'stripe', title: { en: 'Stripe', ar: 'سترايب' } },
  { id: 'cards', title: { en: 'Credit and Debit Cards', ar: 'بطاقات الائتمان والخصم' } },
  { id: 'paymera', title: { en: 'Paymera', ar: 'بيميرا' } },
  { id: 'tabby', title: { en: 'Tabby', ar: 'تابي' } },
  { id: 'tamara', title: { en: 'Tamara', ar: 'تمارا' } },
]

const branchToTabId = {
  'Payment Methods': 'channels',
  Channels: 'channels',
  Stripe: 'stripe',
  'Credit and Debit Cards': 'cards',
  'Cham Pay': 'paymera',
  Paymera: 'paymera',
  Tabby: 'tabby',
  Tamara: 'tamara',
}

export function getQuestionMethodTabId(question) {
  const branch = getFaqLabel(question.branch, 'en')
  return branchToTabId[branch] || 'channels'
}

export function getTopicMethodTabs(topic, questions, language) {
  if (topic?.id !== PAYMENT_METHOD_TOPIC_ID) return []

  const used = new Set(questions.map(getQuestionMethodTabId))

  return paymentMethodTabs
    .filter((tab) => tab.id === 'channels' || used.has(tab.id))
    .map((tab) => ({
      id: tab.id,
      title: getFaqLabel(tab.title, language),
    }))
}

export function getQuestionsForMethodTab(questions, tabId) {
  return questions.filter((question) => getQuestionMethodTabId(question) === tabId)
}
