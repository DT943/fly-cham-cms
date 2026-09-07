/** Arabic dummy copy for the booking box (dynamic airport/date data stays as-is). */
const ar = {
  placeholders: {
    searchAirport: "ابحث عن مطار أو مدينة",
    destination: "إلى",
    checkDate: "تاريخ السفر",
  },
  modalTitles: {
    departure: "المغادرة",
  },
  stepTitles: {
    flyingFrom: "المغادرة  من",
    flyingTo: "الوصول ",
    guests: "المسافرون",
    travelWhen: "موعد السفر",
    departureDate: "تاريخ المغادرة",
    returnDate: "تاريخ العودة",
    departureAndReturnDates: "تواريخ المغادرة والعودة",
    selectDates: "اختر التواريخ",
  },
  guestLabels: {
    adt: "بالغ",
    chd: "طفل",
    inf: "رضيع",
    addGuest: "إضافة ضيف",
    noGuests: "لم يتم اختيار ضيوف",
  },
  airportSelector: {
    fallbacks: {
      departureCity: "مدينة المغادرة",
      arrivalCity: "مدينة الوصول",
      selectOrigin: "اختر نقطة الانطلاق",
      selectDestination: "اختر الوجهة",
    },
    labels: {
      from: "من",
      to: "إلى",
    },
    allAirports: "جميع المطارات",
    newSection: "جديد",
    includeNearbyAirports: "إظهار المطارات القريبة",
  },
  buttons: {
    searchFlights: "البحث عن رحلات",
    modifySearch: "تعديل البحث",
    search: "بحث",
    done: "متابعة",
    continue: "متابعة",
    searching: "جاري البحث...",
    next: "التالي",
    back: "رجوع",
    close: "إغلاق",
    reset: "إعادة تعيين",
  },
  aria: {
    swapOriginDestination: "تبديل نقطة الانطلاق والوجهة",
  },
  tripTypes: {
    roundTrip: "ذهاب وعودة",
    oneWay: "ذهاب فقط",
    multiCity: "وجهات متعددة",
    ariaLabel: "اختر نوع الرحلة",
  },
  tabs: {
    book: "حجز رحلة",
    manage: "إدارة الحجز",
    flightStatus: "حالة الرحلة",
    ariaLabel: "علامات التبويب الرئيسية",
  },
  manage: {
    findBookingTitle: "ابحث عن حجزك",
    pnrLabel: "رقم الحجز (PNR)",
    pnrHint: "مثال: 4XKCT2",
    lastNameLabel: "اسم العائلة",
    cantFindPnr: "لا أستطيع العثور على رقم الحجز",
    pnrTooltip:
      "رمز حجز مكوّن من 6 أحرف موجود في رسالة التأكيد أو إيصال الحجز",
    search: "بحث",
    searching: "جاري البحث",
    cancel: "إلغاء",
    errors: {
      pnrMin: "*يجب أن يتكون رقم الحجز من 6 أحرف",
      pnrRequired: "*يرجى إدخال رقم الحجز",
      pnrAlphanumeric: "*يجب أن يحتوي رقم الحجز على أحرف وأرقام إنجليزية فقط",
      lastNameRequired: "*يرجى إدخال اسم العائلة",
      lastNameEnglish: "يجب أن يحتوي اسم العائلة على أحرف إنجليزية فقط",
    },
  },
  flightInfo: {
    selectDate: "اختر التاريخ",
    addPassengers: "إضافة مسافرين",
    guestsCount: (count) => `${count} ${count === 1 ? "ضيف" : "ضيوف"}`,
    departure: "المغادرة",
    return: "العودة",
    departureDate: "تاريخ المغادرة",
    returnDate: "تاريخ العودة",
    passengersAndClass: "المسافرون ودرجة السفر",
    loading: "جاري التحميل...",
    destination: "الوجهة",
    tripDuration: (days) =>
      days === 1 ? `يوم واحد لرحلتك` : `${days} أيام لرحلتك`,
    flightLeg: (n) => `الرحلة ${n}`,
  },
  milesToggle: {
    label: "الحجز بالأميال",
  },
  passengers: {
    andClass: "المسافرون ودرجة السفر",
    adultCount: (n) => `${n} ${n === 1 ? "بالغ" : "بالغين"}`,
    childCount: (n) => `${n} ${n === 1 ? "طفل" : "طفل"}`,
    infantCount: (n) => `${n} ${n === 1 ? "رضيع" : "رضع"}`,
    infantWithSeatCount: (n) =>
      `${n} ${n === 1 ? "رضيع بمقعد" : "رضع بمقاعد"}`,
    separator: " ، ",
  },
  guests: {
    title: "المسافرون",
    classTitle: "الدرجة",
    ariaLabel: "المسافرون",
    promoCode: "رمز العرض",
    infantLimit: (max) =>
      max === 1
        ? "لا يمكنك حجز تذاكر لأكثر من رضيع واحد سواء بمقعد المرافق أو بمقعد منفصل" :
        max === 2 ? "لا يمكنك حجز تذاكر لأكثر من رضيعين سواء بمقعد المرافق أو بمقعد منفصل"
          : `لا يمكنك حجز تذاكر لأكثر من ${max} أطفال رضّع سواء بمقعد المرافق أو بمقعد منفصل`,
    infantCombinedLimit: (max) =>
      max === 1
        ? "لا يمكنك حجز تذاكر لأكثر من رضيع واحد سواء بمقعد المرافق أو بمقعد منفصل" :
        max === 2 ? "لا يمكنك حجز تذاكر لأكثر من رضيعين سواء بمقعد المرافق أو بمقعد منفصل"
          : `لا يمكنك حجز تذاكر لأكثر من ${max} أطفال رضّع سواء بمقعد المرافق أو بمقعد منفصل`,
    infantPerAdultNote:
      "يُسمح بوجود حجز رضيع واحد فقط لكل شخص بالغ فوق 16 عاماً",
    options: [
      { label: "بالغ", sub: "  12 سنة وما فوق ", key: "adults" },
      { label: "طفل", sub: "2 - 12  سنة", key: "children" },
      { label: "رضيع ", sub: "أقل من سنتين", key: "infants" },
    ],
    optionsV2: [
      { label: "بالغ", sub: "  12 سنة وما فوق ", key: "adults" },
      {
        label: "طفل",
        sub: "2 - 12 سنة",
        key: "children",
        note: "يحصل الطفل بين 2-12 سنة على نفس وزن الأمتعة المسجلة للبالغ.",
      },
      {
        label: "رضيع",
        sub: "أقل من سنتين",
        key: "infants",
        note: "يحصل الرضيع (أقل من عامين) المسافر في مقعد مرافقه على حقيبة يد بوزن 10 كلغ.",
      },
    ],
    infantsWithSeatOption: {
      label: "رضيع بمقعد",
      sub: "أقل من سنتين",
      key: "infantsWithSeat",
      note: "يحصل الرضيع الذي يقل عمره عن عامين ويشغل مقعداً منفصلاً على الأمتعة بحسب فئة التذكرة.",
    },
    cabinClassOptions: [
      { value: "Economy", label: "الدرجة السياحية" },
      { value: "Business", label: "درجة رجال الأعمال" },
    ],
  },
};

export default ar;
