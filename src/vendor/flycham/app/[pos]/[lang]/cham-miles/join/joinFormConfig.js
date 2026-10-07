/**
 * joinFormConfig
 * --------------
 * Pure, content-agnostic configuration for the Cham Miles join form: the
 * title→gender map, the Formik initial values, the Yup schema builder, and the
 * POS/lang allow-lists used to build the legal links. No React — consumed by
 * useJoinForm.
 */

import * as Yup from "yup";

export const TITLE_TO_GENDER = {
  Mr: "Male",
  Mrs: "Female",
  Ms: "Female",
};

export const initialValues = {
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

export function buildValidationSchema(v) {
  return Yup.object({
    title: Yup.string().required(v.titleRequired),
    firstName: Yup.string()
      .trim()
      .min(1, v.firstNameRequired)
      .max(50, v.firstNameTooLong)
      .required(v.firstNameRequired),
    lastName: Yup.string()
      .trim()
      .min(1, v.lastNameRequired)
      .max(50, v.lastNameTooLong)
      .required(v.lastNameRequired),
    email: Yup.string()
      .trim()
      .email(v.emailInvalid)
      .max(255, v.emailTooLong)
      .required(v.emailRequired),
    countryCode: Yup.string().required(v.countryCodeRequired),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{4,15}$/, v.phoneInvalid)
      .required(v.phoneRequired),
    dateOfBirth: Yup.string().required(v.dobRequired),
    acceptTerms: Yup.boolean().oneOf([true], v.termsRequired),
    // Optional — form can submit without marketing opt-in.
    acceptMarketing: Yup.boolean(),
  });
}

export const ALLOWED_POS = ["iq", "om", "sy", "tr", "ae", "am", "kw", "ly", "gb"];
export const ALLOWED_LANG = ["en", "ar"];
export const DEFAULT_POS = "gb";
export const DEFAULT_LANG = "en";
