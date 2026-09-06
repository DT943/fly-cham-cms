import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { withLanguage } from '../../../i18n/languages.js'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'

function useFormAccess(formId) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const language = useCurrentLanguage()

  const validationSchema = useMemo(
    () =>
      yup.object({
        pnr: yup
          .string()
          .trim()
          .matches(/^[A-Z0-9]*$/, {
            message: t('forms.access.errors.pnrAlphanumeric'),
            excludeEmptyString: true,
          })
          .min(6, t('forms.access.errors.pnrMin'))
          .required(t('forms.access.errors.pnrRequired')),
        lastName: yup
          .string()
          .trim()
          .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
            message: t('forms.access.errors.lastNameEnglish'),
            excludeEmptyString: true,
          })
          .required(t('forms.access.errors.lastNameRequired')),
      }),
    [t]
  )

  const formik = useFormik({
    initialValues: {
      pnr: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: ({ pnr, lastName }) => {
      navigate(withLanguage(`/help/contact-us/forms/${formId}`, language), {
        state: {
          pnr: pnr.trim(),
          lastName: lastName.trim(),
        },
      })
    },
  })

  const handlePnrChange = (event) => {
    const value = String(event.target.value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6)
    formik.setFieldValue('pnr', value)
  }

  const handleLastNameChange = (event) => {
    const value = String(event.target.value || '')
      .replace(/[^A-Za-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart()
      .toUpperCase()
    formik.setFieldValue('lastName', value)
  }

  const fieldError = (name) =>
    formik.touched[name] || formik.submitCount > 0 ? formik.errors[name] : undefined

  const canSearch = Boolean(formik.values.pnr) && Boolean(formik.values.lastName?.trim())

  return {
    formik,
    handlePnrChange,
    handleLastNameChange,
    fieldError,
    canSearch,
  }
}

export default useFormAccess
