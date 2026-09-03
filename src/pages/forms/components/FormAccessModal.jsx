import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Ticket, User, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Input from '../../../shared/components/Input.jsx'
import Button from '../../../shared/components/Button.jsx'
import { typography } from '../../../styles/typography.js'
import { withLanguage } from '../../../i18n/languages.js'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'

const FormAccessModal = ({ form, onClose }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const language = useCurrentLanguage()
  const titleId = 'form-access-title'

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
      navigate(withLanguage(`/help/contact-us/forms/${form.id}`, language), {
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-900/40"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-background w-full sm:max-w-2xl md:max-w-3xl rounded-t-2xl sm:rounded-2xl border border-200 shadow-[0_16px_40px_rgba(0,0,0,0.16)] p-5 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-6 max-h-[92vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <h2 id={titleId} className={`${typography.sectionTitle} font-bold text-800 m-0`}>
              {t('forms.access.title')}
            </h2>
            <p className={`${typography.itemDescription} text-600 m-0`}>
              {t('forms.access.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-0 p-1 cursor-pointer text-700 shrink-0"
            aria-label={t('forms.access.close')}
          >
            <X size={22} weight="bold" />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="flex flex-col gap-4 md:gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <Input
              id="form-access-pnr"
              name="pnr"
              icon={Ticket}
              label={t('forms.access.pnr.label')}
              hint={t('forms.access.pnr.hint')}
              dir="ltr"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              maxLength={6}
              autoFocus
              value={formik.values.pnr}
              onChange={handlePnrChange}
              onBlur={formik.handleBlur}
              error={fieldError('pnr')}
            />
            <Input
              id="form-access-last-name"
              name="lastName"
              icon={User}
              label={t('forms.access.lastName.label')}
              autoComplete="family-name"
              autoCapitalize="characters"
              spellCheck="false"
              dir="ltr"
              value={formik.values.lastName}
              onChange={handleLastNameChange}
              onBlur={formik.handleBlur}
              error={fieldError('lastName')}
            />
          </div>
          <Button
            type="submit"
            disabled={!canSearch}
            className={`w-full sm:w-fit sm:self-end ${
              canSearch ? '' : 'opacity-50 cursor-not-allowed hover:bg-secondary'
            }`}
          >
            {t('forms.access.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default FormAccessModal
