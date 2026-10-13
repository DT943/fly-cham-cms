import {
  blockMinutes,
  getRouteOperatingDays,
  hashString,
  seededRandom,
} from '../flight-schedule/scheduleData.js'

/**
 * Placeholder lowest fares until the fares API is wired in. Built on the same
 * placeholder schedule as the Flight Schedule page, so a fare only appears on
 * a day its route operates and prices scale with flight length.
 */

export const CABINS = ['economy', 'business']

const DAY_MS = 24 * 60 * 60 * 1000
const SEARCH_WINDOW_DAYS = 28
const DATES_PER_ROUTE = 2
const BUSINESS_MULTIPLIER = 2.4

const upcomingDepartures = (from, to, today) => {
  const days = getRouteOperatingDays(from, to)
  const dates = []
  for (let offset = 1; offset <= SEARCH_WINDOW_DAYS && dates.length < DATES_PER_ROUTE; offset += 1) {
    const date = new Date(today.getTime() + offset * DAY_MS)
    if (days.includes(date.getDay())) dates.push(date)
  }
  return dates
}

const economyFare = (from, to, date, random) => {
  const base = 90 + blockMinutes(from, to) * 1.4
  const weekendPremium = date.getDay() === 4 || date.getDay() === 5 ? 1.12 : 1
  return Math.round((base + random() * 60) * weekendPremium)
}

/**
 * Lowest-fare rows for every `[from, to]` route: `{ id, from, to, cabin, date, price, updatedHoursAgo }`.
 * `today` is the start of the current day; departures start tomorrow.
 */
export const buildFares = (routes, today) =>
  routes.flatMap(([from, to]) =>
    upcomingDepartures(from, to, today).flatMap((date) => {
      const random = seededRandom(hashString(`${from}-${to}-${date.toDateString()}`))
      const economy = economyFare(from, to, date, random)
      const updatedHoursAgo = 1 + Math.floor(random() * 23)
      return CABINS.map((cabin) => ({
        id: `${from}-${to}-${date.getTime()}-${cabin}`,
        from,
        to,
        cabin,
        date,
        price: cabin === 'business' ? Math.round(economy * BUSINESS_MULTIPLIER) : economy,
        updatedHoursAgo,
      }))
    }),
  )
