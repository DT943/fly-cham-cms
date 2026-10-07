"use client";

import { useMemo, useState } from "react";
import { useFormik } from "formik";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { postProfileData } from "@/services/Api/apiService";
import { useChamMilesContent } from "../shared/ChamMilesContent";
import {
  ALLOWED_LANG,
  ALLOWED_POS,
  DEFAULT_LANG,
  DEFAULT_POS,
  TITLE_TO_GENDER,
  buildValidationSchema,
  initialValues,
} from "./joinFormConfig";

/** Shared join-form state for compact (xs/sm, 2xl) and split (md–xl) layouts. */
export default function useJoinForm() {
  const content = useChamMilesContent();
  const { formValidation: v, formToast, joinForm } = content;

  const validationSchema = useMemo(() => buildValidationSchema(v), [v]);

  const pathname = usePathname();
  const segments = (pathname || "").split("/").filter(Boolean);
  const currentPos = ALLOWED_POS.includes(segments[0]) ? segments[0] : DEFAULT_POS;
  const currentLang = ALLOWED_LANG.includes(segments[1]) ? segments[1] : DEFAULT_LANG;
  const localeBase = `/${currentPos}/${currentLang}`;
  const termsHref = `${localeBase}/legal/terms-and-conditions`;
  const privacyHref = `${localeBase}/legal/privacy-policy`;
  const homeHref = localeBase;

  // Flips true once the early-bird request succeeds → JoinStep swaps the form
  // out for the JoinSuccess screen.
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        title: values.title,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        gender: TITLE_TO_GENDER[values.title] || "Male",
        phoneNumber: `+${String(values.countryCode || '').replace(/\D/g, '')} ${values.phoneNumber}`,
        dateOfBirth: values.dateOfBirth,
      };
      // eslint-disable-next-line no-console
      console.log("[cham-miles] join form submitted", payload);
      try {
        const response = await postProfileData("/member/early-bird", payload);
        // eslint-disable-next-line no-console
        console.log("[cham-miles] early-bird response", response);
        setSubmitted(true);
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          formToast.errorFallback;
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fieldError = () => "";

  const isFormValid = validationSchema.isValidSync(formik.values);

  return {
    formik,
    fieldError,
    termsHref,
    privacyHref,
    isFormValid,
    joinForm,
    submitted,
    homeHref,
  };
}
