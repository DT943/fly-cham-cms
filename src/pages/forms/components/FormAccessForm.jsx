import { Ticket, User } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Input from '../../../shared/components/Input.jsx'
import Button from '../../../shared/components/Button.jsx'
import useFormAccess from '../hooks/useFormAccess.js'
import LookupError from './LookupError.jsx'

const FormAccessForm = ({ formId, bookingSystem }) => {
  const { t } = useTranslation()
  const { formik, handlePnrChange, handleLastNameChange, fieldError, canSearch, lookupError } =
    useFormAccess(formId, bookingSystem)

  return (
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
      <LookupError error={lookupError} />
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
  )
}

export default FormAccessForm
