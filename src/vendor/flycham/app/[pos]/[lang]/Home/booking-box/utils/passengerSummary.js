import en from '@/app/[pos]/[lang]/Home/booking-box/content/en';

/**
 * Build the "Passengers and class" summary line (static labels only; counts stay numeric).
 */
export function buildPassengerSummaryLabel(guestsState = {}, copy = en) {
  const {
    adults = 1,
    children = 0,
    infants = 0,
    infantsWithSeat = 0,
    cabinClass = 'Economy',
  } = guestsState;
  const { passengers, guests, flightInfo } = copy;
  const parts = [];

  if (adults > 0) parts.push(passengers.adultCount(adults));
  if (children > 0) parts.push(passengers.childCount(children));
  if (infants > 0) parts.push(passengers.infantCount(infants));
  if (infantsWithSeat > 0 && passengers.infantWithSeatCount) {
    parts.push(passengers.infantWithSeatCount(infantsWithSeat));
  }

  if (parts.length === 0) {
    return flightInfo.addPassengers;
  }

  const classOption = guests.cabinClassOptions?.find((option) => option.value === cabinClass);
  const classLabel = classOption?.label ?? cabinClass;

  return `${parts.join(passengers.separator)} ${classLabel}`;
}
