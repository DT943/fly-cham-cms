import seatSelectionPhoto from '../../../assets/images/before-you-fly/seat-selection.png'
import manageBookingPhoto from '../../../assets/images/before-you-fly/manage-booking.png'
import yaMarhabaPhoto from '../../../assets/images/before-you-fly/ya-marhaba.png'
import limousinePhoto from '../../../assets/images/before-you-fly/limousine.png'
import unaccompaniedMinorPhoto from '../../../assets/images/before-you-fly/unaccompanied-minor.png'
import oxygenPhoto from '../../../assets/images/before-you-fly/oxygen.png'

/**
 * Pre-departure services, rendered as a divided vertical list (thumbnail +
 * copy + "Learn More"). Copy comes from `beforeYouFly.services.<id>`; `href`
 * is the Learn More target.
 */
export const beforeYouFlyServices = [
  { id: 'seatSelection', image: seatSelectionPhoto, href: '/help' },
  { id: 'manageBooking', image: manageBookingPhoto, href: '/help' },
  { id: 'allowedBaggage', image: manageBookingPhoto, href: '/help' },
  { id: 'paymentMethods', image: manageBookingPhoto, href: '/help' },
  { id: 'yaMarhaba', image: yaMarhabaPhoto, href: '/help' },
  { id: 'limousine', image: limousinePhoto, href: '/help' },
  { id: 'unaccompaniedMinor', image: unaccompaniedMinorPhoto, href: '/help' },
  { id: 'oxygenCylinder', image: oxygenPhoto, href: '/help' },
  { id: 'prohibitedItems', image: oxygenPhoto, href: '/help' },
]
