/** English copy for the cham-miles immersive page (layout stays LTR). */
const en = {
  navLinks: [
    { label: "Benefits", step: "benefits", progress: 0.133 },
    { label: "Early Bird", step: "early-bird", progress: 0.466 },
    { label: "Our Tiers", step: "our-tiers", progress: 0.732 },
    { label: "Join", step: "join", progress: 0.95 },
  ],
  hero: {
    title: "Welcome to Cham Miles",
    description:
      "Your journey with FlyCham becomes more rewarding from the moment you join with our loyalty program",
    scrollLabel: "scroll down",
  },
  secondLayer: {
    eyebrow: "Step into",
    titleStart: "Your ",
    titleAccent: "Premium ",
    titleEnd: "journey",
    description:
      "Enjoy priority services, seamless bookings, personalized travel experiences, and exclusive member-only access all for free.",
    scrollLabel: "scroll down",
  },
  tiersIntro: {
    title: "Tiers and Benefits",
    description:
      "Every journey with ChamMiles brings you closer to more rewards, comfort, and exclusive travel privileges.",
    cta: "Discover more",
  },
  benefitsPanel: {
    title: "Benefits that matter to you",
    intro:
      "ChamMiles brings you closer to exclusive rewards, travel comfort, and privileges made for frequent flyers.",
    cta: "Early Bird",
    items: [
      {
        title: "Free Ticket",
        desc: "Redeem your ChamMiles for free tickets and get closer to your next destination with every mile you earn.",
      },
      {
        title: "Discounted Prices",
        desc: "Enjoy access to special discounted fares and exclusive offers available to Cham Miles Early Bird members..",
      },
      {
        title: "Customize Offers",
        desc: "Receive personalized promotions, special fares, and exclusive deals tailored to your travel preferences",
      },
      {
        title: "E-Store",
        desc: "Use your miles to explore exclusive rewards and travel related offers and travel-related benefits through our e-store.",
      },

    ],
  },
  joinEarly: {
    titleMobile: ["Join Early ", "Earn", " More"],
    titleDesktop: ["Join Early", "Earn", "More"],
    description:
      "Be among the first ChamMiles members and enjoy early rewards, exclusive updates, and special chances to win.",
    cta: "Discover the tiers",
    marquee: ["Bonus Miles", "Special Prices", "Early News"],
  },
  ourTiers: {
    title: "Our Tiers",
    subtitle:
      "Move through the ChamMiles tiers and discover benefits designed to make every journey more rewarding.",
    cta: "Become a Member",
    viewDetails: "View Details",
    back: "Back",
    cards: [
      { title: "Blue Tier", sub: "Free to join" },
      { title: "Silver Tier", sub: "25,000 Tier Miles" },
      { title: "Gold Tier", sub: "50,000 Tier Miles" },
      { title: "Diamond Tier", sub: "75,000 Tier Miles" },
    ],
  },
  detailTabs: [
    {
      key: "blue",
      label: "Blue",
      color: "#006080",
      heading: "Free to join",
      bullets: [
        "Join Blue tier for free by registering through our website. This tier is a complementary tier and has no benefits or expiration date.",
      ],
    },
    {
      key: "silver",
      label: "Silver",
      color: "#9CA3AF",
      heading: "25,000 Tier Miles",
      bullets: [
        "10kg extra baggage, priority baggage handling, and priority check-in.",
        "50% off seat selection for added comfort before your flight.",
        "25% bonus miles on every eligible flight.",
        "Lounge access, plus the option to redeem miles for free tickets or upgrades.",
      ],
    },
    {
      key: "gold",
      label: "Gold",
      color: "#C9B27A",
      heading: "50,000 Tier Miles",
      bullets: [
        "20kg extra baggage, priority baggage handling, and priority check-in.",
        "Free seat selection for a more comfortable journey.",
        "50% bonus miles on every eligible flight.",
        "Lounge access with a guest, plus the option to redeem miles for free tickets or upgrades.",
      ],
    },
    {
      key: "diamond",
      label: "Diamond",
      color: "#1F2937",
      heading: "75,000 Tier Miles",
      bullets: [
        "30kg extra baggage, priority baggage handling, and priority check-in.",
        "Complimentary seat selection for added comfort on every journey.",
        "75% bonus miles on every eligible flight.",
        "Lounge access with a guest, plus the option to redeem miles for free tickets or upgrades.",
      ],
    },
  ],
  mobileTiers: [
    {
      label: "Blue Tier",
      heading: "Free to join",
      desc: "Join Blue tier for free by registering through our website. This tier is a complementary tier and has no benefits or expiration date.",
      dot: "#006080",
    },
    {
      label: "Silver Tier",
      heading: "25,000 Tier Miles",
      desc: "10kg extra baggage, priority baggage handling, and priority check-in.\n 50% off seat selection for added comfort before your flight.\n 25% bonus miles on every eligible flight.\n Lounge access with a guest, plus the option to redeem miles for free tickets or upgrades.",
      dot: "#9CA3AF",
    },
    {
      label: "Gold Tier",
      heading: "50,000 Tier Miles",
      desc: "20kg extra baggage, priority baggage handling, and priority check-in.\n Free seat selection for a more comfortable journey.\n 50% bonus miles on every eligible flight.\n Lounge access with a guest, plus the option to redeem miles for free tickets or upgrades.",
      dot: "#C9B27A",
    },
    {
      label: "Diamond Tier",
      heading: "75,000 Tier Miles",
      desc: "30kg extra baggage, priority baggage handling, and priority check-in.\n Complimentary seat selection for added comfort on every journey.\n 75% bonus miles on every eligible flight.\n Lounge access with a guest, plus the option to redeem miles for free tickets or upgrades.",
      dot: "#1F2937",
    },
  ],
  tierDetails: {
    joinNow: "Join now",
    cardAlt: "ChamMiles Blue Tier card",
    goToTier: "Go to",
  },
  joinStep: {
    titleJoin: "Join ",
    titleAccent: "Cham Miles",
    titleToday: " Today",
    titleTodaySplit: "Today",
    descriptionDesktop:
      "Create your free ChamMiles account and start earning miles, unlocking rewards, and enjoying exclusive travel benefits with every journey.",
    descriptionMobile:
      "Join ChamMiles for free and start earning rewards every journey.",
    // Shown in place of the form once the join request succeeds.
    successScreen: {
      title: "You're In!",
      subtitle: "Early Bird Member",
      description:
        "Welcome to the club! As an Early Bird, you get exclusive perks, early access to new features, and special pricing that's locked in for life.",
      tagline: "Thanks for joining the journey!",
      cta: "Return to Fly Cham",
    },
  },
  joinForm: {
    title: "Create an Account",
    passportHint: "Ensure the name provided matches your passport.",
    fields: {
      title: "Title",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      dateOfBirth: "Date of birth",
      countryCode: "Country code",
      phone: "Call number",
    },
    consentTermsBefore: "I agree with Fly Cham",
    consentTermsLink: "Terms and conditions",
    consentTermsMiddle: "and",
    consentPrivacyLink: "privacy policy",
    consentMarketing: "I agree to receive marketing messages from Fly Cham",
    submit: "Continue",
    submitting: "Submitting...",
    titleOptions: [
      { label: "Mr", value: "Mr" },
      { label: "Mrs", value: "Mrs" },
      { label: "Ms", value: "Ms" },
    ],
    countrySearchPlaceholder: "Search country or code",
    countryNoMatches: "No matches found",
  },
  formValidation: {
    titleRequired: "Title is required",
    firstNameRequired: "First name is required",
    firstNameTooLong: "First name is too long",
    lastNameRequired: "Last name is required",
    lastNameTooLong: "Last name is too long",
    emailInvalid: "Enter a valid email address",
    emailTooLong: "Email is too long",
    emailRequired: "Email is required",
    countryCodeRequired: "Country code is required",
    phoneInvalid: "Enter 4–15 digits",
    phoneRequired: "Call number is required",
    dobRequired: "Date of birth is required",
    termsRequired: "You must agree to the Terms of Service and Privacy Policy",
    marketingRequired: "You must agree to receive marketing messages from Fly Cham",
  },
  formToast: {
    success: "You're on the list! We'll be in touch with your ChamMiles details.",
    errorFallback: "Something went wrong. Please try again.",
  },
  a11y: {
    scrollDown: "Scroll down",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    flyChamHome: "Fly Cham Home",
  },
  formFooter: {
    copyright: (year) => `© All Rights Reserved, Fly Cham ${year}`,
    legalNavAriaLabel: "Legal links",
    legalLinks: [
      { label: "Cookies policy", href: "/legal/cookies-policy" },
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Terms and Conditions", href: "/legal/terms-and-conditions" },
    ],
  },
};

export default en;
