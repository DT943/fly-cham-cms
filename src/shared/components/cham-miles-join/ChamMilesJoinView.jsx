import { useEffect, useMemo, useRef, useState } from "react";
import { createSubmitAttemptId, trackChamMilesRegister } from "../../analytics/cmsEvents.js";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSnapchat,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { GlobeSimpleIcon } from "@phosphor-icons/react";
import countries from "./countries";
import { mapPhoneCountryOptions } from "./phoneCountryLabel";
import { JoinCheckbox, JoinInput, JoinSelect } from "./JoinControls";
import JoinDobInput from "./JoinDobInput";
import { TITLE_TO_GENDER, chamMilesJoinThemeVars, normalizeChamMilesJoinContent } from "./defaults";
import "./chamMilesJoin.css";

/*
 * Cham Miles "Join" step — the last step of flychamwebsite's /cham-miles page,
 * as a standalone full-screen section: title + description, the
 * "Create an Account" card, the success screen and the footer bar.
 *
 * Shared file: identical in new_fly_cham (src/shared/components/cham-miles-join)
 * and flychamadmin (src/cms2/cmsComponents/ChamMilesJoin/view).
 *
 * Props
 *  - content       CMS content for `lang` (normalised here; see defaults.js)
 *  - style         theme colours (CHAM_MILES_JOIN_THEME_VARS keys)
 *  - lang          "en" | "ar"
 *  - resolveHref   CMS href → app URL (default: as-is)
 *  - LinkComponent component for internal links (receives `href`), default <a>
 *  - onSubmit      async (payload) => void; omitted = preview (no request)
 *  - showSuccess   force the success screen (editor preview)
 */

const TITLE_PER_CHAR = 0.022;
const GROUP_GAP = 0.12;
const FADE_UP_EASE = [0.22, 1, 0.36, 1];
const charCount = (s) => [...(s ?? "")].length;

const SOCIAL_ICON = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  tiktok: FaTiktok,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  twitter: FaXTwitter,
  threads: FaThreads,
  youtube: FaYoutube,
  snapchat: FaSnapchat,
};

const isExternal = (href) => /^(https?:|mailto:|tel:|\/\/)/i.test(String(href || ""));

/** Typewriter title: per-character (Latin) or one clip wipe (Arabic keeps letters joined). */
function WriteOn({ segments, play, startDelay = 0, joined = false }) {
  const full = segments.map((s) => s.text ?? "").join("");
  if (joined) {
    const count = Math.max(charCount(full), 1);
    const step = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.ceil(t * count) / count);
    return (
      <>
        <span className="cmj-sr-only">{full}</span>
        <motion.span
          aria-hidden="true"
          className="cmj-writeon--joined"
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: play ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)" }}
          transition={{ duration: play ? count * TITLE_PER_CHAR : 0.12, ease: play ? step : "easeOut", delay: play ? startDelay : 0 }}
        >
          {segments.map((seg, i) => (
            <span key={i} className={`${seg.className ?? ""} cmj-writeon__seg`}>
              {seg.text}
            </span>
          ))}
        </motion.span>
      </>
    );
  }
  let running = 0;
  return (
    <>
      <span className="cmj-sr-only">{full}</span>
      <span aria-hidden="true">
        {segments.map((seg, si) => (
          <span key={si} className={`${seg.className ?? ""} cmj-writeon__char-run`}>
            {[...(seg.text ?? "")].map((ch, ci) => {
              const delay = startDelay + running * TITLE_PER_CHAR;
              running += 1;
              return (
                <motion.span
                  key={ci}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: play ? 1 : 0 }}
                  transition={{ duration: 0.06, ease: "easeOut", delay: play ? delay : 0 }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
        ))}
      </span>
    </>
  );
}

function FadeUp({ play, delay = 0, children }) {
  return (
    <motion.span
      style={{ display: "block" }}
      initial={{ opacity: 0, y: 14 }}
      animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.55, ease: FADE_UP_EASE, delay: play ? delay : 0 }}
    >
      {children}
    </motion.span>
  );
}

function SmartLink({ href, LinkComponent, children, ...props }) {
  if (!href) return <span {...props}>{children}</span>;
  if (isExternal(href) || !LinkComponent) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <LinkComponent href={href} {...props}>
      {children}
    </LinkComponent>
  );
}

const validationSchema = Yup.object({
  title: Yup.string().required(),
  firstName: Yup.string().trim().max(50).required(),
  lastName: Yup.string().trim().max(50).required(),
  email: Yup.string().trim().email().max(255).required(),
  countryCode: Yup.string().required(),
  phoneNumber: Yup.string().matches(/^[0-9]{4,15}$/).required(),
  dateOfBirth: Yup.string().required(),
  acceptTerms: Yup.boolean().oneOf([true]),
  acceptMarketing: Yup.boolean(),
});

const INITIAL_VALUES = {
  title: "",
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "",
  phoneNumber: "",
  dateOfBirth: "",
  acceptTerms: false,
  acceptMarketing: false,
};

function JoinFormCard({ c, isAr, href, LinkComponent, onSubmit, onSuccess }) {
  const [submitError, setSubmitError] = useState("");
  const countryOptions = useMemo(
    () => mapPhoneCountryOptions(countries, { rtl: isAr, locale: isAr ? "ar" : "en" }),
    [isAr]
  );
  const titleOptions = useMemo(
    () => c.titleOptions.filter((o) => o.label).map((o) => ({ value: o.value, label: o.label })),
    [c.titleOptions]
  );

  const attemptRef = useRef("");
  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      // Editor preview: no request, just show the success screen.
      if (!onSubmit) {
        onSuccess();
        setSubmitting(false);
        return;
      }
      try {
        const attemptId = attemptRef.current || createSubmitAttemptId();
        await onSubmit({
          title: values.title,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          gender: TITLE_TO_GENDER[values.title] || "Male",
          phoneNumber: `+${String(values.countryCode || "").replace(/\D/g, "")} ${values.phoneNumber}`,
          dateOfBirth: values.dateOfBirth,
        });
        onSuccess();
        trackChamMilesRegister({
          eventAction: "result",
          result: "success",
          submitAttemptId: attemptId,
          formLocation: "cham_miles_join",
        });
      } catch (err) {
        trackChamMilesRegister({
          eventAction: "result",
          result: "error",
          submitAttemptId: attemptRef.current,
          formLocation: "cham_miles_join",
        });
        setSubmitError(err?.response?.data?.message || err?.message || c.errorFallback);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isValid = validationSchema.isValidSync(formik.values);
  const set = (key) => (value) => formik.setFieldValue(key, value);

  return (
    <div className="cmj-card">
      {c.formTitle ? <h3 className="cmj-card__title">{c.formTitle}</h3> : null}
      <form
        className="cmj-form"
        noValidate
        onSubmit={(event) => {
          const attemptId = createSubmitAttemptId();
          attemptRef.current = attemptId;
          if (validationSchema.isValidSync(formik.values)) {
            trackChamMilesRegister({
              eventAction: "attempt",
              submitAttemptId: attemptId,
              formLocation: "cham_miles_join",
            });
          } else {
            trackChamMilesRegister({
              eventAction: "result",
              result: "validation_error",
              submitAttemptId: attemptId,
              formLocation: "cham_miles_join",
            });
          }
          return formik.handleSubmit(event);
        }}
        onKeyDown={(event) => {
          // Only the real submit button submits (iOS "Return" would otherwise).
          if (event.key === "Enter" && event.target?.type !== "submit" && event.target?.tagName !== "TEXTAREA") {
            event.preventDefault();
          }
        }}
      >
        {c.passportHint ? <p className="cmj-hint">{c.passportHint}</p> : null}

        <div className="cmj-row cmj-row--3">
          <JoinSelect label={c.titleLabel} value={formik.values.title} options={titleOptions} onChange={set("title")} />
          <JoinInput id="cmj-firstName" label={c.firstNameLabel} value={formik.values.firstName} onChange={(e) => set("firstName")(e.target.value)} autoComplete="given-name" />
          <JoinInput id="cmj-lastName" label={c.lastNameLabel} value={formik.values.lastName} onChange={(e) => set("lastName")(e.target.value)} autoComplete="family-name" />
        </div>

        <JoinInput id="cmj-email" type="email" label={c.emailLabel} value={formik.values.email} onChange={(e) => set("email")(e.target.value)} autoComplete="email" />

        <div className="cmj-row cmj-row--2">
          <JoinSelect
            label={c.countryCodeLabel}
            value={formik.values.countryCode}
            options={countryOptions}
            onChange={set("countryCode")}
            searchable
            wide
            searchPlaceholder={c.countrySearchPlaceholder}
            noMatchesText={c.countryNoMatches}
          />
          <JoinInput
            id="cmj-phone"
            type="tel"
            inputMode="numeric"
            label={c.phoneLabel}
            value={formik.values.phoneNumber}
            onChange={(e) => set("phoneNumber")(e.target.value.replace(/\D/g, ""))}
            autoComplete="tel-national"
          />
        </div>

        <JoinDobInput
          label={c.dobLabel}
          value={formik.values.dateOfBirth}
          onChange={set("dateOfBirth")}
          isAr={isAr}
          placeholders={{ day: c.dobDayPlaceholder, month: c.dobMonthPlaceholder, year: c.dobYearPlaceholder }}
        />

        <div className="cmj-consents">
          <JoinCheckbox checked={formik.values.acceptTerms} onChange={set("acceptTerms")}>
            {/* One span per text piece: the admin inline editor binds to a text
                node's parent, so pieces must not share one. */}
            <span>{c.consentTermsBefore}</span>
            {" "}
            <SmartLink href={href(c.termsHref)} LinkComponent={LinkComponent} className="cmj-check__link" target="_blank" rel="noopener noreferrer">
              {c.consentTermsLink}
            </SmartLink>
            {" "}
            <span>{c.consentTermsMiddle}</span>
            {" "}
            <SmartLink href={href(c.privacyHref)} LinkComponent={LinkComponent} className="cmj-check__link" target="_blank" rel="noopener noreferrer">
              {c.consentPrivacyLink}
            </SmartLink>
            .
          </JoinCheckbox>
          <JoinCheckbox checked={formik.values.acceptMarketing} onChange={set("acceptMarketing")}>
            {c.consentMarketing}
          </JoinCheckbox>
        </div>

        <button type="submit" className="cmj-submit" disabled={formik.isSubmitting || !isValid}>
          {formik.isSubmitting ? c.submittingLabel : c.submitLabel}
        </button>
        {submitError ? (
          <p className="cmj-error" role="alert">
            {submitError}
          </p>
        ) : null}
      </form>
    </div>
  );
}

const successContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const successItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: FADE_UP_EASE } },
};

function JoinSuccess({ c, href, LinkComponent }) {
  return (
    <motion.div className="cmj-success" variants={successContainer} initial="hidden" animate="visible">
      <motion.span
        className="cmj-success__icon"
        aria-hidden="true"
        variants={{
          hidden: { opacity: 0, scale: 0.6 },
          visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 18 } },
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" width="100%" height="100%">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 12.2l2.6 2.6L16 9.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.span>
      {c.successTitle ? <motion.h2 variants={successItem} className="cmj-success__title">{c.successTitle}</motion.h2> : null}
      {c.successSubtitle ? <motion.p variants={successItem} className="cmj-success__subtitle">{c.successSubtitle}</motion.p> : null}
      {c.successDescription ? <motion.p variants={successItem} className="cmj-success__desc">{c.successDescription}</motion.p> : null}
      {c.successTagline ? <motion.p variants={successItem} className="cmj-success__tagline">{c.successTagline}</motion.p> : null}
      {c.successCtaLabel ? (
        <motion.div variants={successItem}>
          <SmartLink href={href(c.successCtaHref) || href("/")} LinkComponent={LinkComponent} className="cmj-success__cta">
            {c.successCtaLabel}
          </SmartLink>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function JoinFooter({ c, href, LinkComponent }) {
  const year = new Date().getFullYear();
  const legal = c.legalLinks.filter((l) => l.label);
  const social = c.socialLinks.filter((s) => s.href);
  return (
    <footer className="cmj-footer">
      <div className="cmj-footer__inner">
        <div className="cmj-footer__row">
          <div className="cmj-footer__brand">
            {c.footerLogo ? (
              <SmartLink href={href(c.homeHref)} LinkComponent={LinkComponent} className="cmj-footer__logo-link" aria-label={c.footerLogoAlt}>
                <img src={c.footerLogo} alt={c.footerLogoAlt} width={180} height={40} className="cmj-footer__logo" decoding="async" />
              </SmartLink>
            ) : null}
            {c.copyright ? <p className="cmj-footer__copyright">{c.copyright.replace(/\{year\}/g, String(year))}</p> : null}
          </div>
          {legal.length ? (
            <nav className="cmj-footer__legal" aria-label={c.legalNavAriaLabel}>
              {legal.map((link, i) => (
                <SmartLink key={`${link.label}-${i}`} href={href(link.href)} LinkComponent={LinkComponent}>
                  {link.label}
                </SmartLink>
              ))}
            </nav>
          ) : null}
          <div className="cmj-footer__social">
            {social.map((s, i) => {
              const Icon = SOCIAL_ICON[s.icon] || GlobeSimpleIcon;
              return (
                <a key={`${s.icon}-${i}`} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.icon || "social"}>
                  <Icon size={11} aria-hidden />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function ChamMilesJoinView({
  content,
  style,
  lang = "en",
  resolveHref,
  LinkComponent,
  onSubmit,
  showSuccess = false,
}) {
  const isAr = lang === "ar";
  const c = useMemo(() => normalizeChamMilesJoinContent(content, lang), [content, lang]);
  const themeVars = useMemo(() => chamMilesJoinThemeVars(style), [style]);
  const href = (value) => (resolveHref ? resolveHref(value) : value) || "";
  const [submitted, setSubmitted] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setPlay(true), 150);
    return () => window.clearTimeout(t);
  }, []);

  const success = submitted || showSuccess;
  const todayText = c.titleToday.replace(/^\s+/, "");
  const todayGap = todayText !== c.titleToday ? c.titleToday.slice(0, c.titleToday.length - todayText.length) : "";
  const line1Len = charCount(c.titleJoin) + charCount(c.titleAccent) + charCount(todayGap);
  const subDelay = (line1Len + charCount(todayText)) * TITLE_PER_CHAR + GROUP_GAP;

  return (
    <section
      className={`cmj${success ? " cmj--success" : ""}`}
      dir={isAr ? "rtl" : "ltr"}
      lang={lang}
      style={themeVars}
    >
      {c.backgroundImage ? (
        <div className="cmj__backdrop" aria-hidden="true" style={{ backgroundImage: `url("${c.backgroundImage}")` }} />
      ) : null}

      <div className="cmj__main">
        {success ? (
          <JoinSuccess c={c} href={href} LinkComponent={LinkComponent} />
        ) : (
          <>
            <div className="cmj__intro">
              <h2 className="cmj__title">
                <WriteOn
                  play={play}
                  joined={isAr}
                  segments={[
                    { text: c.titleJoin, className: "cmj__title-primary" },
                    { text: c.titleAccent, className: "cmj__title-accent" },
                    { text: todayGap, className: "cmj__title-gap" },
                  ]}
                />
                <span className="cmj__title-break cmj__title-primary">
                  <WriteOn play={play} joined={isAr} startDelay={line1Len * TITLE_PER_CHAR} segments={[{ text: todayText }]} />
                </span>
              </h2>
              {c.descriptionDesktop ? (
                <p className="cmj__desc cmj__desc--desktop">
                  <FadeUp play={play} delay={subDelay}>
                    {c.descriptionDesktop}
                  </FadeUp>
                </p>
              ) : null}
              {c.descriptionMobile ? (
                <p className="cmj__desc cmj__desc--mobile">
                  <FadeUp play={play} delay={subDelay}>
                    {c.descriptionMobile}
                  </FadeUp>
                </p>
              ) : null}
            </div>
            <div className="cmj__form-wrap">
              <JoinFormCard
                c={c}
                isAr={isAr}
                href={href}
                LinkComponent={LinkComponent}
                onSubmit={onSubmit}
                onSuccess={() => setSubmitted(true)}
              />
            </div>
          </>
        )}
      </div>

      <JoinFooter c={c} href={href} LinkComponent={LinkComponent} />
    </section>
  );
}
