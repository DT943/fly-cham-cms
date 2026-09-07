/** English static copy for the booking box (dynamic airport/date data stays as-is). */
const en = {
  placeholders: {
    searchAirport: "Search for airport or city",
    destination: "To",
    checkDate: "Check Date",
  },
  modalTitles: {
    departure: "Departure",
  },
  stepTitles: {
    flyingFrom: "Flying from",
    flyingTo: "Flying to",
    guests: "Guests",
    travelWhen: "Travel when",
    departureDate: "Departure date",
    returnDate: "Return date",
    departureAndReturnDates: "Departure and return dates",
    selectDates: "Select dates",
  },
  guestLabels: {
    adt: "ADT",
    chd: "CHD",
    inf: "INF",
    ins: "INS",
    addGuest: "Add Guest",
    noGuests: "No guests selected",
  },
  airportSelector: {
    fallbacks: {
      departureCity: "Departure city",
      arrivalCity: "Arrival city",
      selectOrigin: "Select your origin",
      selectDestination: "Select your destination",
    },
    labels: {
      from: "From",
      to: "To",
    },
    allAirports: "All airports",
    newSection: "New",
    includeNearbyAirports: "Include nearby airports",
  },
  buttons: {
    searchFlights: "Search flights",
    modifySearch: "Modify search",
    search: "Search",
    done: "Continue",
    continue: "Continue",
    searching: "Searching...",
    next: "Next",
    back: "Back",
    close: "Close",
    reset: "Reset",
  },
  aria: {
    swapOriginDestination: "Swap origin and destination",
  },
  tripTypes: {
    roundTrip: "Round-trip",
    oneWay: "One-way",
    multiCity: "Multi-city",
    ariaLabel: "Select trip type",
  },
  tabs: {
    book: "Book",
    manage: "Manage",
    flightStatus: "Flight status",
    ariaLabel: "Main navigation tabs",
  },
  manage: {
    findBookingTitle: "Find your booking",
    pnrLabel: "Reservation number (PNR)",
    pnrHint: "ex.4XKCT2",
    lastNameLabel: "Last name",
    cantFindPnr: "I can’t find my Reservation number",
    pnrTooltip:
      "A 6-character reservation code found in your confirmation email or receipt",
    search: "Search",
    searching: "Searching",
    cancel: "Cancel",
    errors: {
      pnrMin: "*PNR must be 6 characters",
      pnrRequired: "*please enter your Reservation number",
      pnrAlphanumeric: "*PNR must contain only English letters and numbers",
      lastNameRequired: "*please enter your last name",
      lastNameEnglish: "Last name must contain only English letters",
    },
  },
  flightInfo: {
    selectDate: "Select date",
    addPassengers: "Add passengers",
    guestsCount: (count) => `Guest${count > 1 ? "s" : ""} x ${count}`,
    departure: "Departure",
    return: "Return",
    departureDate: "Departure date",
    returnDate: "Return date",
    passengersAndClass: "Passengers & Class",
    loading: "Loading...",
    destination: "Destination",
    tripDuration: (days) =>
      `${days} ${days === 1 ? "day" : "days"} your trip`,
    flightLeg: (n) => `Flight ${n}`,
  },
  milesToggle: {
    label: "Book with Miles",
  },
  passengers: {
    andClass: "Passengers and class",
    adultCount: (n) => `${n} ${n === 1 ? "Adult" : "Adults"}`,
    childCount: (n) => `${n} ${n === 1 ? "Child" : "Children"}`,
    infantCount: (n) => `${n} ${n === 1 ? "Infant" : "Infants"}`,
    infantWithSeatCount: (n) =>
      `${n} Infant${n === 1 ? "" : "s"} with seat`,
    separator: " , ",
  },
  guests: {
    title: "Guests",
    classTitle: "Class",
    ariaLabel: "Guests",
    promoCode: "Promo Code",
    infantLimit: (max) =>
      `You cannot book tickets for more than ${max} infant${max === 1 ? "" : "s"} whether in an accompanying seat or a separate seat`,
    infantCombinedLimit: (max) =>
      `You cannot book tickets for more than ${max} infant${max === 1 ? "" : "s"} whether in an accompanying seat or a separate seat`,
    infantPerAdultNote:
      "Only one Infant is permitted per adult above 16 years old",
    options: [
      { label: "Adults", sub: "+12 Years", key: "adults" },
      { label: "Children", sub: "2 - 11 years", key: "children" },
      { label: "Infants", sub: "Under 2 years", key: "infants" },
    ],
    optionsV2: [
      { label: "Adults", sub: "+12 Years", key: "adults" },
      {
        label: "Child",
        sub: "2 - 12 Years",
        key: "children",
        note: "Child between 2 and 12 Years old receives the same baggage allowance as adults.",
      },
      {
        label: "Infant",
        sub: "Under 2 Years",
        key: "infants",
        note: "A lap infant under 2 years old receives a 10kg hand baggage allowance.",
      },
    ],
    infantsWithSeatOption: {
      label: "Infant with seat",
      sub: "Under 2 Years",
      key: "infantsWithSeat",
      note: "An infant under 2 years in a separate seat receives baggage allowance per ticket fare type.",
    },
    cabinClassOptions: [
      { value: "Economy", label: "Economy" },
      { value: "Business", label: "Business" },
    ],
  },
};

export default en;
