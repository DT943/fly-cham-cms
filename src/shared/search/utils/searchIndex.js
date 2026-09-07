import en from '../../../i18n/locales/en.json'
import ar from '../../../i18n/locales/ar.json'
import { faqCategories } from '../../../pages/faqs/utils/faqData.js'
import { supportForms } from '../../../pages/forms/utils/supportForms.js'
import { helpCategories } from '../../../pages/help/utils/helpCategories.jsx'
import { journeySteps } from '../../../pages/help/utils/journeySteps.js'
import { contactChannels } from '../../../pages/contact-us/utils/contactChannels.jsx'
import { contactForms } from '../../../pages/contact-us/utils/contactForms.jsx'
import { searchHitId } from './searchHit.js'
import { ECONOMY_CHECKED_BAGGAGE_QUESTION_ID, getEconomyCheckedBaggageSearchText } from '../../../pages/faqs/utils/economyCheckedBaggage.js'
import { ECONOMY_REFUND_FEES_QUESTION_ID, getEconomyRefundFeesSearchText } from '../../../pages/faqs/utils/economyRefundFees.js'
import { FARE_COMPARISON_QUESTION_ID, getFareComparisonSearchText } from '../../../pages/faqs/utils/fareComparison.js'
import { FLIGHT_CHANGE_FEES_QUESTION_ID, getFlightChangeFeesSearchText } from '../../../pages/faqs/utils/flightChangeFees.js'
import {
  destinationFaqIds,
  destinationNetwork,
  getDestinationNetworkSearchText,
} from '../../../pages/our-destinations/utils/destinationFaqs.js'

const helpCategoryDestinations = {
  contact: { href: '/help/contact-us', target: 'contact-hero' },
  faqs: { href: '/help/faqs', target: 'faqs-hero' },
  offices: { href: '/help/contact-us/our-offices', target: 'offices-hero' },
  forms: { href: '/help/contact-us/forms', target: 'forms-hero' },
  track: { href: '/help/contact-us/forms', target: 'forms-track' },
}

const contactChannelDestinations = {
  salesOffices: { href: '/help/contact-us/our-offices', target: 'offices-hero' },
  gsa: { href: '/help/contact-us/our-gsa', target: 'gsa-hero' },
  request: { href: '/help/contact-us/forms', target: 'forms-hero' },
}

const contactFormDestinations = {
  payment: 'paymentIssue',
  refund: 'refund',
  baggage: 'lostBaggage',
  assistance: 'wheelchair',
}

function pick(locale, path) {
  return path.split('.').reduce((value, key) => value?.[key], locale) || ''
}

function localized(path) {
  return {
    en: pick(en, path),
    ar: pick(ar, path),
  }
}

function joinLocalized(paths) {
  return {
    en: paths.map((path) => pick(en, path)).filter(Boolean).join(' '),
    ar: paths.map((path) => pick(ar, path)).filter(Boolean).join(' '),
  }
}

function pageRecord({ id, href, titlePath, textPaths = [], target }) {
  const title = localized(titlePath)
  if (!title.en && !title.ar) return null

  return {
    id: `page:${id}`,
    type: 'page',
    href,
    targetId: searchHitId(target || id),
    title,
    text: joinLocalized(textPaths),
  }
}

function buildFaqRecords() {
  const records = []
  const extraTextByQuestion = {
    [FARE_COMPARISON_QUESTION_ID]: getFareComparisonSearchText(),
    [FLIGHT_CHANGE_FEES_QUESTION_ID]: getFlightChangeFeesSearchText(),
    [ECONOMY_REFUND_FEES_QUESTION_ID]: getEconomyRefundFeesSearchText(),
    [ECONOMY_CHECKED_BAGGAGE_QUESTION_ID]: getEconomyCheckedBaggageSearchText(),
  }

  faqCategories.forEach((category) => {
    category.topics.forEach((topic) => {
      topic.questions.forEach((question) => {
        const extraText = extraTextByQuestion[question.id] || null
        records.push({
          id: `faq:${question.id}`,
          type: 'faq',
          href: '/help/faqs',
          targetId: searchHitId(question.id),
          questionId: question.id,
          title: question.question,
          text: {
            en: [topic.title?.en, category.title?.en, question.answer?.en, extraText?.en].filter(Boolean).join(' '),
            ar: [topic.title?.ar, category.title?.ar, question.answer?.ar, extraText?.ar].filter(Boolean).join(' '),
          },
        })
      })
    })
  })

  return records
}

function buildPageRecords() {
  const records = [
    pageRecord({
      id: 'help-hero',
      href: '/help',
      titlePath: 'help.hero.title',
      textPaths: ['help.hero.subtitle'],
    }),
    pageRecord({
      id: 'help-categories',
      href: '/help',
      titlePath: 'help.categories.title',
      textPaths: ['help.categories.subtitle'],
    }),
    pageRecord({
      id: 'help-journey',
      href: '/help',
      titlePath: 'help.journey.title',
      textPaths: ['help.journey.subtitle'],
    }),
    pageRecord({
      id: 'help-urgent',
      href: '/help',
      titlePath: 'help.urgent.title',
      textPaths: ['help.urgent.description'],
    }),
    pageRecord({
      id: 'contact-hero',
      href: '/help/contact-us',
      titlePath: 'contact.hero.title',
      textPaths: ['contact.hero.subtitle'],
    }),
    pageRecord({
      id: 'contact-channels',
      href: '/help/contact-us',
      titlePath: 'contact.channels.title',
    }),
    pageRecord({
      id: 'contact-forms',
      href: '/help/contact-us',
      titlePath: 'contact.forms.title',
      textPaths: ['contact.forms.subtitle'],
    }),
    pageRecord({
      id: 'contact-get-in-touch',
      href: '/help/contact-us',
      titlePath: 'contact.getInTouch.title',
      textPaths: ['contact.getInTouch.label', 'contact.getInTouch.note'],
    }),
    pageRecord({
      id: 'contact-flight-status',
      href: '/help/contact-us',
      titlePath: 'contact.flightStatus.title',
      textPaths: ['contact.flightStatus.description'],
    }),
    pageRecord({
      id: 'offices-hero',
      href: '/help/contact-us/our-offices',
      titlePath: 'offices.hero.title',
      textPaths: ['offices.hero.subtitle'],
    }),
    pageRecord({
      id: 'gsa-hero',
      href: '/help/contact-us/our-gsa',
      titlePath: 'gsa.hero.title',
      textPaths: ['gsa.hero.subtitle'],
    }),
    pageRecord({
      id: 'forms-hero',
      href: '/help/contact-us/forms',
      titlePath: 'forms.hero.title',
      textPaths: ['forms.hero.subtitle'],
    }),
    pageRecord({
      id: 'forms-track',
      href: '/help/contact-us/forms',
      titlePath: 'forms.track.title',
      textPaths: ['forms.track.subtitle'],
    }),
    pageRecord({
      id: 'faqs-hero',
      href: '/help/faqs',
      titlePath: 'faq.hero.title',
      textPaths: ['faq.hero.subtitle'],
    }),
    pageRecord({
      id: 'destinations-hero',
      href: '/our-destinations',
      titlePath: 'destinations.hero.title',
      textPaths: ['destinations.hero.subtitle'],
    }),
    pageRecord({
      id: 'destinations-explore',
      href: '/our-destinations',
      titlePath: 'destinations.explore.title',
      textPaths: ['destinations.explore.subtitle'],
    }),
    pageRecord({
      id: 'destinations-inspiration',
      href: '/our-destinations',
      titlePath: 'destinations.inspiration.title',
      textPaths: ['destinations.inspiration.description'],
    }),
    pageRecord({
      id: 'damascus-hero',
      href: '/our-destinations/flights-to-damascus',
      titlePath: 'flightsToDamascus.breadcrumb',
      textPaths: ['flightsToDamascus.hero.country', 'flightsToDamascus.stats.airport.detail'],
    }),
    pageRecord({
      id: 'damascus-narratives',
      href: '/our-destinations/flights-to-damascus',
      titlePath: 'flightsToDamascus.narratives.special.title',
      textPaths: [
        'flightsToDamascus.narratives.special.description',
        'flightsToDamascus.narratives.cuisine.title',
        'flightsToDamascus.narratives.cuisine.description',
        'flightsToDamascus.narratives.places.title',
        'flightsToDamascus.narratives.places.description',
        'flightsToDamascus.narratives.activities.title',
        'flightsToDamascus.narratives.activities.description',
      ],
    }),
    pageRecord({
      id: 'damascus-things-to-do',
      href: '/our-destinations/flights-to-damascus',
      titlePath: 'flightsToDamascus.thingsToDo.title',
      textPaths: [
        'flightsToDamascus.thingsToDo.subtitle',
        'flightsToDamascus.thingsToDo.items.umayyadMosque.title',
        'flightsToDamascus.thingsToDo.items.umayyadMosque.description',
      ],
    }),
    pageRecord({
      id: 'destinations-faqs',
      href: '/our-destinations',
      titlePath: 'destinations.faqs.title',
      textPaths: destinationFaqIds.flatMap((id) => [
        `destinations.faqs.items.${id}.question`,
        `destinations.faqs.items.${id}.answer`,
      ]),
    }),
    ...destinationFaqIds.map((id) => {
      const record = pageRecord({
        id: `destinations-faq-${id}`,
        href: '/our-destinations',
        titlePath: `destinations.faqs.items.${id}.question`,
        textPaths: [
          `destinations.faqs.items.${id}.answer`,
          `destinations.faqs.items.${id}.note`,
          ...(id === 'baggage'
            ? ['light', 'smart', 'elite', 'business', 'cabin'].map(
                (key) => `destinations.faqs.items.baggage.list.${key}`
              )
            : []),
          ...(id === 'whereWeFly'
            ? destinationNetwork.flatMap((country) => [
                `destinations.faqs.countries.${country.countryKey}`,
                ...country.cities.map((city) => `destinations.faqs.cities.${city.cityKey}`),
              ])
            : []),
        ],
      })

      if (id === 'whereWeFly' && record) {
        const network = getDestinationNetworkSearchText()
        record.text = {
          en: [record.text.en, network.en].filter(Boolean).join(' '),
          ar: [record.text.ar, network.ar].filter(Boolean).join(' '),
        }
      }

      return record
    }),
  ]

  helpCategories.forEach((category) => {
    const destination = helpCategoryDestinations[category.id] || {
      href: category.href || '/help',
      target: `help-category-${category.id}`,
    }

    records.push(
      pageRecord({
        id: `help-category-${category.id}`,
        href: destination.href,
        target: destination.target,
        titlePath: `help.categories.items.${category.id}.title`,
        textPaths: [`help.categories.items.${category.id}.description`],
      })
    )
  })

  journeySteps.forEach((step) => {
    records.push(
      pageRecord({
        id: `help-journey-${step.id}`,
        href: '/help',
        target: 'help-journey',
        titlePath: `help.journey.steps.${step.id}.title`,
        textPaths: step.linkKeys.map((key) => `help.journey.steps.${step.id}.links.${key}`),
      })
    )
    step.linkKeys.forEach((key) => {
      records.push(
        pageRecord({
          id: `help-journey-${step.id}-${key}`,
          href: '/help',
          target: 'help-journey',
          titlePath: `help.journey.steps.${step.id}.links.${key}`,
          textPaths: [`help.journey.steps.${step.id}.title`],
        })
      )
    })
  })

  contactChannels.forEach((channel) => {
    const destination = contactChannelDestinations[channel.id] || {
      href: channel.href || '/help/contact-us',
      target: 'contact-channels',
    }

    records.push(
      pageRecord({
        id: `contact-channel-${channel.id}`,
        href: destination.href,
        target: destination.target,
        titlePath: `contact.channels.items.${channel.id}.title`,
        textPaths: [`contact.channels.items.${channel.id}.description`],
      })
    )
  })

  contactForms.forEach((form) => {
    const formId = contactFormDestinations[form.id]
    records.push(
      pageRecord({
        id: `contact-form-${form.id}`,
        href: '/help/contact-us/forms',
        target: formId ? `form-${formId}` : 'forms-hero',
        titlePath: `contact.forms.items.${form.id}.title`,
        textPaths: [`contact.forms.items.${form.id}.description`],
      })
    )
  })

  supportForms.forEach((form) => {
    records.push({
      id: `form:${form.id}`,
      type: 'form',
      href: '/help/contact-us/forms',
      targetId: searchHitId(`form-${form.id}`),
      title: localized(`forms.items.${form.id}.title`),
      text: {
        en: [pick(en, `forms.items.${form.id}.description`), ...(form.keywords || [])].join(' '),
        ar: pick(ar, `forms.items.${form.id}.description`),
      },
    })
  })

  return records.filter(Boolean)
}

export const searchIndex = [...buildFaqRecords(), ...buildPageRecords()]
