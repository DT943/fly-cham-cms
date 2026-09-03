import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { X } from '@phosphor-icons/react'
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
        pnr: yup.string().trim().required(t('forms.access.errors.required')),
        lastName: yup.string().trim().required(t('forms.access.errors.required')),
      }),
    [t]
  )

  const formik = useFormik({
    initialValues: {
      pnr: '',
      lastName: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      navigate(withLanguage(`/help/contact-us/forms/${form.id}`, language), {
        state: {
          pnr: values.pnr.trim(),
          lastName: values.lastName.trim(),
        },
      })
    },
  })

  const fieldError = (name) =>
    formik.submitCount > 0 ? formik.errors[name] : undefined

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
        className="bg-background w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.16)] p-5 sm:p-6 md:p-8 flex flex-col gap-5 md:gap-6 max-h-[92vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
            {t(`forms.items.${form.id}.title`)}
          </h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <Input
              id="form-access-pnr"
              name="pnr"
              label={t('forms.access.pnr.label')}
              dir="ltr"
              autoComplete="off"
              autoFocus
              value={formik.values.pnr}
              onChange={formik.handleChange}
              error={fieldError('pnr')}
            />
            <Input
              id="form-access-last-name"
              name="lastName"
              label={t('forms.access.lastName.label')}
              autoComplete="family-name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={fieldError('lastName')}
            />
          </div>
          <Button type="submit" className="w-full sm:w-fit">
            {t('forms.access.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default FormAccessModal
