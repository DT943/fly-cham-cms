import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { withLanguage } from '../../../i18n/languages.js'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { BOOKING_SYSTEMS, retrieveBooking } from '../api/retrieveBooking.js'

function useFormAccess(formId, bookingSystem = BOOKING_SYSTEMS.accelAero) {
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

  // Set when the PNR lookup misses; cleared on the next search.
  const [lookupError, setLookupError] = useState(null)

  const formik = useFormik({
    initialValues: {
      pnr: '',
      lastName: '',
    },
    validationSchema,
    // Find Booking looks the PNR up in the system chosen for this block in the
    // CMS and, on a hit, continues to the form with the booking.
    onSubmit: async ({ pnr, lastName }) => {
      setLookupError(null)
      const trimmedPnr = pnr.trim()
      const trimmedLastName = lastName.trim()
      const response = await retrieveBooking(bookingSystem, {
        pnr: trimmedPnr,
        lastName: trimmedLastName,
        language,
      })

      if (response.ok) {
        navigate(withLanguage(`/help/contact-us/forms/${formId}`, language), {
          state: {
            pnr: trimmedPnr,
            lastName: trimmedLastName,
            system: bookingSystem,
            booking: response.data,
            session: response.session ?? null,
          },
        })
        return
      }

      setLookupError({
        title: response.alert?.title || t('forms.access.lookup.notFoundTitle'),
        description:
          response.alert?.description ||
          t(response.timedOut ? 'forms.access.lookup.timeout' : 'forms.access.lookup.genericError'),
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

  const canSearch =
    Boolean(formik.values.pnr) && Boolean(formik.values.lastName?.trim()) && !formik.isSubmitting

  return {
    formik,
    handlePnrChange,
    handleLastNameChange,
    fieldError,
    canSearch,
    searching: formik.isSubmitting,
    lookupError,
  }
}

export default useFormAccess
