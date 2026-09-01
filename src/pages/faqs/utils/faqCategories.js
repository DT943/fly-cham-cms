import faqPh1 from '../../../assets/images/faq/ph1.png'
import {
  AirTrafficControl,
  ArrowsClockwise,
  CalendarBlank,
  CalendarX,
  Handshake,
  Headset,
  Package,
  PawPrint,
  SealQuestion,
  Seat,
  Ticket,
  TrolleySuitcase,
  UserCheck,
} from '@phosphor-icons/react'

export const faqCategories = [
  {
    id: 'booking',
    icon: Ticket,
    topics: [
      { id: 'bookingOnline', questionIds: ['bookingNumber', 'beforeConfirming', 'transferTicket', 'addInfant', 'passengerAge', 'passengersPerBooking'] },
      { id: 'classesFareTypes', questionIds: [] },
      { id: 'manageBooking', questionIds: [] },
    ],
  },
  { id: 'modifications', icon: ArrowsClockwise, topics: [] },
  { id: 'cancellations', icon: CalendarX, topics: [] },
  { id: 'baggage', icon: TrolleySuitcase, topics: [] },
  { id: 'flightSchedules', icon: CalendarBlank, topics: [] },
  { id: 'beforeYouTravel', icon: UserCheck, topics: [] },
  { id: 'atTheAirport', icon: AirTrafficControl, topics: [] },
  { id: 'onboardExperience', icon: Seat, topics: [] },
  { id: 'cargo', icon: Package, topics: [] },
  { id: 'becomePartner', icon: Handshake, topics: [] },
  { id: 'travelInformation', icon: SealQuestion, topics: [] },
  { id: 'travelWithPet', icon: PawPrint, topics: [] },
  { id: 'support', icon: Headset, topics: [] },
]

export const faqQuestionImages = {
  bookingNumber: faqPh1,
}

export function findFaqCategory(categories, topicId) {
  return (
    categories.find((category) =>
      category.topics.some((topic) => topic.id === topicId)
    ) || categories.find((category) => category.id === topicId) || categories[0]
  )
}

export function findFaqTopic(category, topicId) {
  return category.topics.find((topic) => topic.id === topicId) || null
}
