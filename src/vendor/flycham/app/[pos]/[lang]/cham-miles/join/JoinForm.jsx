"use client";

import { useMemo } from "react";
import Link from "next/link";
import countries from "@/util/countries";
import { mapPhoneCountryOptions } from "@/util/phoneCountryLabel";
import { useChamMilesLang } from "../shared/ChamMilesContent";
import JoinFormSplit from "./JoinFormSplit";
import JoinFormCompact from "./JoinFormCompact";

/**
 * Cham Miles join form — computes the values shared by both layouts (country
 * options, consent labels, submit label) and routes to the matching variant:
 * - compact: cham-miles branch (xs/sm + 2xl centered step)
 * - split: md–xl side-by-side step with grid field structure
 */
export default function JoinForm({
  variant = "compact",
  formik,
  fieldError,
  termsHref,
  privacyHref,
  isFormValid,
  joinForm,
}) {
  const f = joinForm.fields;
  const titleOptions = joinForm.titleOptions;
  const { isAr } = useChamMilesLang();
  const formArClass = isAr ? " cm-join-form--ar" : "";
  const countryOptions = useMemo(
    () => mapPhoneCountryOptions(countries, { rtl: isAr, locale: isAr ? "ar" : "en" }),
    [isAr],
  );

  const consentTermsLabel = (
    <span className="cm-join-consent__label text-(--cm-form-text)" style={{ fontSize: "14px" }}>
      {joinForm.consentTermsBefore}
      {"\u00A0"}
      <Link
        href={termsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="cm-join-consent__link text-(--cm-primary) hover:underline"
        style={{ fontSize: "14px" }}
      >
        {joinForm.consentTermsLink}
      </Link>
      {"\u00A0"}
      {joinForm.consentTermsMiddle}
      {"\u00A0"}
      <Link
        href={privacyHref}
        target="_blank"
        rel="noopener noreferrer"
        className="cm-join-consent__link text-(--cm-primary) hover:underline"
        style={{ fontSize: "14px" }}
      >
        {joinForm.consentPrivacyLink}
      </Link>
      .
    </span>
  );

  const consentMarketingLabel = (
    <span className="text-(--cm-form-text)" style={{ fontSize: "14px" }}>
      {joinForm.consentMarketing}
    </span>
  );
  const submitLabel = formik.isSubmitting ? joinForm.submitting : joinForm.submit;

  const shared = {
    formik,
    fieldError,
    isFormValid,
    f,
    titleOptions,
    countryOptions,
    consentTermsLabel,
    consentMarketingLabel,
    submitLabel,
    formArClass,
    joinForm,
  };

  return variant === "split" ? (
    <JoinFormSplit {...shared} />
  ) : (
    <JoinFormCompact {...shared} />
  );
}
