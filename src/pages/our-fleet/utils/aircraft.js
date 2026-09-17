/**
 * Fly Cham fleet — one entry per aircraft, in the order shown in the design.
 * Names and seat counts are language-agnostic, so they live here rather than in
 * the i18n bundles; the surrounding labels (Economy / Business / Total seats)
 * are translated in the `ourFleet.card` namespace.
 */
export const fleet = [
  { id: 'baa-a320-233', name: 'Airbus BAA A320-233', economy: 138, business: 12, totalSeats: 150 },
  { id: 'bac-a320-232', name: 'Airbus BAC A320-232', economy: 141, business: 12, totalSeats: 153 },
  { id: 'bae-a320-231', name: 'Airbus BAE A320-231', economy: 144, business: 12, totalSeats: 156 },
  { id: 'bag-a320-212', name: 'Airbus BAG A320-212', economy: 144, business: 12, totalSeats: 156 },
  { id: 'bab-a320-211', name: 'Airbus BAB A320-211', economy: 144, business: 12, totalSeats: 156 },
]
