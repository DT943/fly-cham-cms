"use client";

import Input from "@/components/Ui/Input";
import CustomDropdown from "@/components/Ui/TitleDropdown";
import CustomCheckbox from "@/components/Ui/CustomCheckbox";
import ErrorMessage from "@/components/Ui/ErrorMessage";
import JoinDateOfBirthInput from "./JoinDateOfBirthInput";
import blockImplicitFormSubmitOnEnter from "./blockImplicitFormSubmitOnEnter";

/**
 * JoinForm — compact layout (cham-miles branch: xs/sm + 2xl centered step).
 * Presentational only: all state + derived values are computed by JoinForm and
 * passed in.
 */
export default function JoinFormCompact({
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
    <div className={`cm-join-card cm-join-card--compact flex flex-col overflow-hidden rounded-xl bg-[rgba(229,229,227,0.80)] ${formArClass}`}>
      <h3 className="cm-join-card__title shrink-0 px-5 pt-5 pb-3.5 text-base font-semibold text-(--cm-form-text) md:px-7 md:pt-[30px] md:pb-6 md:text-lg">
        {joinForm.title}
      </h3>

      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={blockImplicitFormSubmitOnEnter}
        className="cm-join-form-body cm-join-form-body--compact flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-5 md:gap-4 md:px-7 md:pb-[30px]"
        noValidate
      >
        <p className="cm-join-passport-hint cm-join-passport-hint--compact m-0 text-sm text-(--cm-form-text)">
          {joinForm.passportHint}
        </p>

        <div className="cm-join-form-row cm-join-form-row--title-name grid grid-cols-3 gap-2 md:gap-3">
          <div>
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
          <div>
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
          <div>
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

        <div>
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

        <div className="cm-join-form-row cm-join-form-row--pair grid grid-cols-2 gap-3">
          <div>
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
          <div>
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

        <div className="cm-join-dob">
          <JoinDateOfBirthInput
            label={f.dateOfBirth}
            value={formik.values.dateOfBirth}
            onChange={(val) => formik.setFieldValue("dateOfBirth", val)}
            error={Boolean(fieldError("dateOfBirth"))}
            onBlurValidate={() => formik.setFieldTouched("dateOfBirth", true)}
          />
          <ErrorMessage error={fieldError("dateOfBirth")} />
        </div>

        <div className="cm-join-consent mt-1.5 md:mt-2">
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
          className={`cm-join-submit mt-2 h-12 w-full rounded-lg text-[16px] font-semibold transition-colors md:mt-3 md:h-[55px] md:text-[18px] ${
            isFormValid && !formik.isSubmitting
              ? "bg-(--cm-primary) text-(--cm-button-text) hover:opacity-90"
              : "cursor-not-allowed bg-300 text-500"
          }`}
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
