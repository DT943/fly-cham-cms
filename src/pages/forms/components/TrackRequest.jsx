import { useMemo } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import Input from '../../../shared/components/Input.jsx'
import { typography } from '../../../styles/typography.js'

const TrackRequest = () => {
  const { t } = useTranslation()

  const validationSchema = useMemo(
    () =>
      yup.object({
        caseNumber: yup.string().trim().required(t('forms.track.errors.required')),
        lastName: yup.string().trim().required(t('forms.track.errors.required')),
      }),
    [t]
  )

  const formik = useFormik({
    initialValues: {
      caseNumber: '',
      lastName: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log(values)
    },
  })

  const fieldError = (name) =>
    formik.submitCount > 0 ? formik.errors[name] : undefined

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-1">
        <h2 className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
          {t('forms.track.title')}
        </h2>
        <p className={`${typography.sectionDescription} text-600 m-0`}>
          {t('forms.track.subtitle')}
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4 md:gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <Input
            id="caseNumber"
            name="caseNumber"
            label={t('forms.track.caseNumber.label')}
            dir="ltr"
            autoComplete="off"
            value={formik.values.caseNumber}
            onChange={formik.handleChange}
            error={fieldError('caseNumber')}
          />
          <Input
            id="lastName"
            name="lastName"
            label={t('forms.track.lastName.label')}
            autoComplete="family-name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={fieldError('lastName')}
          />
        </div>
        <button
          type="submit"
          className={`${typography.button} font-medium text-50 bg-primary-1 hover:bg-primary-800 border-none rounded-lg px-6 py-3 w-fit cursor-pointer transition-colors`}
        >
          {t('forms.track.submit')}
        </button>
      </form>
    </section>
  )
}

export default TrackRequest
