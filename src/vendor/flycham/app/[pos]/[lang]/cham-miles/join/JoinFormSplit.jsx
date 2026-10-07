"use client";

import Input from "@/components/Ui/Input";
import CustomDropdown from "@/components/Ui/TitleDropdown";
import CustomCheckbox from "@/components/Ui/CustomCheckbox";
import ErrorMessage from "@/components/Ui/ErrorMessage";
import JoinDateOfBirthInput from "./JoinDateOfBirthInput";
import blockImplicitFormSubmitOnEnter from "./blockImplicitFormSubmitOnEnter";

/**
 * JoinForm — split layout (md–xl side-by-side step with a grid field structure).
 * Presentational only: all state + derived values are computed by JoinForm and
 * passed in.
 */
export default function JoinFormSplit({
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
}) {
  return (
    <div className={`cm-join-card flex flex-col overflow-hidden rounded-xl bg-[rgba(229,229,227,0.80)] shadow-2xl${formArClass}`}>
      <h3 className="cm-join-card__title text-lg shrink-0 font-semibold text-(--cm-form-text)">
        {joinForm.title}
      </h3>

      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={blockImplicitFormSubmitOnEnter}
        className="cm-join-form-body flex flex-col"
        noValidate
      >
        <div className="cm-join-form-cluster">
          <div className="cm-join-form-row cm-join-form-row--identity">
            <div className="cm-join-field cm-join-field--title">
              <div className="bg-(--cm-surface) rounded-md">
                <CustomDropdown
                  label={f.title}
                  selected={formik.values.title}
                  onChange={(val) => formik.setFieldValue("title", val)}
                  options={titleOptions}
                  placeholder=""
                  error={Boolean(fieldError("title"))}
                />
              </div>
              <ErrorMessage error={fieldError("title")} />
            </div>
            <p className="cm-join-passport-hint m-0 text-sm text-(--cm-form-text)">
              {joinForm.passportHint}
            </p>
            <div className="cm-join-field cm-join-field--first">
              <Input
                id="firstName"
                name="firstName"
                label={f.firstName}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={fieldError("firstName")}
                className="!bg-(--cm-surface) text-(--cm-form-text)"
              />
              <ErrorMessage error={fieldError("firstName")} />
            </div>
            <div className="cm-join-field cm-join-field--last">
              <Input
                id="lastName"
                name="lastName"
                label={f.lastName}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={fieldError("lastName")}
                className="!bg-(--cm-surface) text-(--cm-form-text)"
              />
              <ErrorMessage error={fieldError("lastName")} />
            </div>
          </div>
        </div>

        <div className="cm-join-form-field">
          <Input
            id="email"
            name="email"
            type="email"
            label={f.email}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={fieldError("email")}
            className="!bg-(--cm-surface) text-(--cm-form-text)"
          />
          <ErrorMessage error={fieldError("email")} />
        </div>

        <div className="cm-join-form-contact">
          <div className="cm-join-form-field cm-join-field--dob">
            <JoinDateOfBirthInput
              label={f.dateOfBirth}
              value={formik.values.dateOfBirth}
              onChange={(val) => formik.setFieldValue("dateOfBirth", val)}
              error={Boolean(fieldError("dateOfBirth"))}
              onBlurValidate={() => formik.setFieldTouched("dateOfBirth", true)}
            />
            <ErrorMessage error={fieldError("dateOfBirth")} />
          </div>
          <div className="cm-join-form-row cm-join-form-row--pair">
            <div className="cm-join-field cm-join-field--country">
              <div className="bg-(--cm-surface) rounded-md">
                <CustomDropdown
                  label={f.countryCode}
                  selected={formik.values.countryCode}
                  onChange={(val) => formik.setFieldValue("countryCode", val)}
                  options={countryOptions}
                  placeholder=""
                  type="countries"
                  error={Boolean(fieldError("countryCode"))}
                  searchPlaceholder={joinForm.countrySearchPlaceholder}
                  noMatchesText={joinForm.countryNoMatches}
                />
              </div>
              <ErrorMessage error={fieldError("countryCode")} />
            </div>
            <div className="cm-join-field cm-join-field--phone">
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                label={f.phone}
                value={formik.values.phoneNumber}
                onChange={(e) =>
                  formik.setFieldValue(
                    "phoneNumber",
                    e.target.value.replace(/\D/g, ""),
                  )
                }
                error={fieldError("phoneNumber")}
                inputMode="numeric"
                pattern="[0-9]*"
                className="!bg-(--cm-surface) text-(--cm-form-text)"
              />
              <ErrorMessage error={fieldError("phoneNumber")} />
            </div>
          </div>
        </div>

        <div className="cm-join-consent">
          <div>
            <CustomCheckbox
              checked={formik.values.acceptTerms}
              onChange={() =>
                formik.setFieldValue("acceptTerms", !formik.values.acceptTerms)
              }
              error={Boolean(fieldError("acceptTerms"))}
              label={consentTermsLabel}
              labelColor="var(--cm-form-text)"
            />
            <ErrorMessage error={fieldError("acceptTerms")} />
          </div>
          <div>
            <CustomCheckbox
              checked={formik.values.acceptMarketing}
              onChange={() =>
                formik.setFieldValue(
                  "acceptMarketing",
                  !formik.values.acceptMarketing,
                )
              }
              error={Boolean(fieldError("acceptMarketing"))}
              label={consentMarketingLabel}
              labelColor="var(--cm-form-text)"
            />
            <ErrorMessage error={fieldError("acceptMarketing")} />
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting || !isFormValid}
          className="cm-join-submit w-full rounded-lg bg-(--cm-primary) font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
