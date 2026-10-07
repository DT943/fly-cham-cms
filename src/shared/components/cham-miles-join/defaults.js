/**
 * Cham Miles "Join" step — default content + theme map.
 *
 * Shared, framework-free module: the same `cham-miles-join/` folder lives in
 * new_fly_cham (src/shared/components/cham-miles-join) and in flychamadmin
 * (src/cms2/cmsComponents/ChamMilesJoin/view). Keep the two copies identical.
 *
 * Copy is the latest join step of flychamwebsite's /cham-miles page
 * (content/en.js + ar.js → joinStep / joinForm / formToast / formFooter).
 * Images come only from the CMS media bucket.
 */

export const CHAM_MILES_JOIN_MEDIA =
  "https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/cham-miles";

/** Title options the API understands (value → gender sent to /member/early-bird). */
export const TITLE_TO_GENDER = { Mr: "Male", Mrs: "Female", Ms: "Female", Miss: "Female" };
export const TITLE_VALUES = Object.keys(TITLE_TO_GENDER);

export const SOCIAL_ICONS = [
  "facebook",
  "instagram",
  "whatsapp",
  "telegram",
  "tiktok",
  "linkedin",
  "x",
  "threads",
  "youtube",
  "snapchat",
];

const SOCIAL_LINKS = [
  {
    icon: "facebook",
    href: "https://www.facebook.com/people/%D9%81%D9%84%D8%A7%D9%8A-%D8%B4%D8%A7%D9%85-Fly-Cham/61575817032233/",
  },
  { icon: "instagram", href: "https://www.instagram.com/fly.cham/" },
  { icon: "whatsapp", href: "https://www.whatsapp.com/channel/0029Vb61PQ2HQbS4UsXPC83a" },
  { icon: "telegram", href: "https://t.me/flychamchannel" },
  { icon: "tiktok", href: "https://www.tiktok.com/@flycham" },
  { icon: "linkedin", href: "https://www.linkedin.com/company/fly-cham/" },
  { icon: "x", href: "https://x.com/fly_cham" },
  { icon: "threads", href: "https://www.threads.com/@fly.cham" },
];

const SHARED = {
  backgroundImage: `${CHAM_MILES_JOIN_MEDIA}/tier-bg.webp`,
  footerLogo: `${CHAM_MILES_JOIN_MEDIA}/header-logo.webp`,
  footerLogoAlt: "Fly Cham",
  homeHref: "/",
  termsHref: "/legal/terms-and-conditions",
  privacyHref: "/legal/privacy-policy",
  successCtaHref: "/",
};

const EN = {
  ...SHARED,
  titleJoin: "Join ",
  titleAccent: "Cham Miles",
  titleToday: " Today",
  descriptionDesktop:
    "Create your free ChamMiles account and start earning miles, unlocking rewards, and enjoying exclusive travel benefits with every journey.",
  descriptionMobile: "Join ChamMiles for free and start earning rewards every journey.",
  formTitle: "Create an Account",
  passportHint: "Ensure the name provided matches your passport.",
  titleLabel: "Title",
  titleOptions: [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Ms", value: "Ms" },
  ],
  firstNameLabel: "First Name",
  lastNameLabel: "Last Name",
  emailLabel: "Email",
  countryCodeLabel: "Country code",
  countrySearchPlaceholder: "Search country or code",
  countryNoMatches: "No matches found",
  phoneLabel: "Call number",
  dobLabel: "Date of birth",
  dobDayPlaceholder: "Day",
  dobMonthPlaceholder: "Month",
  dobYearPlaceholder: "Year",
  consentTermsBefore: "I agree with Fly Cham",
  consentTermsLink: "Terms and conditions",
  consentTermsMiddle: "and",
  consentPrivacyLink: "privacy policy",
  consentMarketing: "I agree to receive marketing messages from Fly Cham",
  submitLabel: "Continue",
  submittingLabel: "Submitting...",
  errorFallback: "Something went wrong. Please try again.",
  successTitle: "You're In!",
  successSubtitle: "Early Bird Member",
  successDescription:
    "Welcome to the club! As an Early Bird, you get exclusive perks, early access to new features, and special pricing that's locked in for life.",
  successTagline: "Thanks for joining the journey!",
  successCtaLabel: "Return to Fly Cham",
  copyright: "© All Rights Reserved, Fly Cham {year}",
  legalNavAriaLabel: "Legal links",
  legalLinks: [
    { label: "Cookies policy", href: "/legal/cookies-policy" },
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms and Conditions", href: "/legal/terms-and-conditions" },
  ],
  socialLinks: SOCIAL_LINKS,
};

const AR = {
  ...SHARED,
  titleJoin: "انضم إلى ",
  titleAccent: "شام مايلز",
  titleToday: " اليوم",
  descriptionDesktop:
    "أنشئ حساب شام مايلز المجاني وابدأ بكسب الأميال وفتح المكافآت والاستمتاع بمزايا السفر الحصرية في كل رحلة.",
  descriptionMobile: "انضم إلى شام مايلز مجانًا وابدأ بكسب المكافآت في كل رحلة.",
  formTitle: "إنشاء حساب",
  passportHint: "تأكد من أن الاسم المدخل يطابق جواز سفرك.",
  titleLabel: "اللقب",
  titleOptions: [
    { label: "السيد", value: "Mr" },
    { label: "السيدة", value: "Mrs" },
    { label: "الآنسة", value: "Ms" },
  ],
  firstNameLabel: "الاسم الأول",
  lastNameLabel: "اسم العائلة",
  emailLabel: "البريد الإلكتروني",
  countryCodeLabel: "رمز الدولة",
  countrySearchPlaceholder: "ابحث عن الدولة أو الرمز",
  countryNoMatches: "لا توجد نتائج",
  phoneLabel: "رقم الهاتف",
  dobLabel: "تاريخ الميلاد",
  dobDayPlaceholder: "اليوم",
  dobMonthPlaceholder: "الشهر",
  dobYearPlaceholder: "السنة",
  consentTermsBefore: "أوافق على",
  consentTermsLink: "الشروط والأحكام",
  consentTermsMiddle: "و",
  consentPrivacyLink: "سياسة الخصوصية",
  consentMarketing: "أوافق على تلقي رسائل تسويقية من فلاي شام",
  submitLabel: "متابعة",
  submittingLabel: "جارٍ الإرسال...",
  errorFallback: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  successTitle: "تم تسجيلك!",
  successSubtitle: "عضو الطائر المبكر",
  successDescription:
    "مرحبًا بك في النادي! بصفتك من الطيور المبكرة، تحصل على مزايا حصرية ووصول مبكر إلى الميزات الجديدة وأسعار خاصة مثبتة مدى الحياة.",
  successTagline: "شكرًا لانضمامك إلى الرحلة!",
  successCtaLabel: "العودة إلى فلاي شام",
  copyright: "© جميع الحقوق محفوظة، فلاي شام {year}",
  legalNavAriaLabel: "روابط قانونية",
  legalLinks: [
    { label: "سياسة ملفات تعريف الارتباط", href: "/legal/cookies-policy" },
    { label: "سياسة الخصوصية", href: "/legal/privacy-policy" },
    { label: "الشروط والأحكام", href: "/legal/terms-and-conditions" },
  ],
  socialLinks: SOCIAL_LINKS,
};

/** Default (seed) content for one language — fresh copy, safe to mutate. */
export function getDefaultChamMilesJoinContent(lang = "en") {
  return JSON.parse(JSON.stringify(lang === "ar" ? AR : EN));
}

/** Every string field of the content (lists handled separately). */
export const CHAM_MILES_JOIN_TEXT_KEYS = Object.keys(EN).filter(
  (key) => typeof EN[key] === "string"
);

/**
 * Normalise stored CMS content: every string key present (missing → default),
 * lists sanitised. An author-cleared string stays empty (no image / no text).
 */
export function normalizeChamMilesJoinContent(content, lang = "en") {
  const defaults = getDefaultChamMilesJoinContent(lang);
  const source = content && typeof content === "object" ? content : {};
  const out = {};
  for (const key of CHAM_MILES_JOIN_TEXT_KEYS) {
    out[key] = typeof source[key] === "string" ? source[key] : defaults[key];
  }
  const list = (key, map) =>
    Array.isArray(source[key]) ? source[key].map(map).filter(Boolean) : defaults[key];
  out.titleOptions = list("titleOptions", (o) =>
    o && typeof o === "object"
      ? {
          label: String(o.label ?? ""),
          value: TITLE_VALUES.includes(o.value) ? o.value : "Mr",
        }
      : null
  );
  out.legalLinks = list("legalLinks", (l) =>
    l && typeof l === "object" ? { label: String(l.label ?? ""), href: String(l.href ?? "") } : null
  );
  out.socialLinks = list("socialLinks", (s) =>
    s && typeof s === "object"
      ? { icon: String(s.icon ?? "").toLowerCase(), href: String(s.href ?? "") }
      : null
  );
  return out;
}

/**
 * CMS style key → CSS custom property (defaults live in chamMilesJoin.css).
 * Values are theme tokens ("primary-1") or raw CSS colours.
 */
export const CHAM_MILES_JOIN_THEME_VARS = {
  pageBg: "--cmj-page-bg",
  primaryColor: "--cmj-primary",
  accentColor: "--cmj-accent",
  textColor: "--cmj-text",
  formTextColor: "--cmj-form-text",
  cardBg: "--cmj-card-bg",
  inputBg: "--cmj-input-bg",
  buttonTextColor: "--cmj-button-text",
  footerBg: "--cmj-footer-bg",
  footerTextColor: "--cmj-footer-text",
  footerIconColor: "--cmj-footer-icon",
  successTitleColor: "--cmj-success-title",
  successTextColor: "--cmj-success-text",
  successIconColor: "--cmj-success-icon",
};

const RAW_COLOR = /^(#|rgb|hsl|var\(|color-mix|transparent)/i;

/** Style object → inline CSS variables for the section root. */
export function chamMilesJoinThemeVars(style) {
  const vars = {};
  for (const [key, cssVar] of Object.entries(CHAM_MILES_JOIN_THEME_VARS)) {
    const value = typeof style?.[key] === "string" ? style[key].trim() : "";
    if (!value) continue;
    vars[cssVar] = RAW_COLOR.test(value) ? value : `var(--color-${value})`;
  }
  return vars;
}
