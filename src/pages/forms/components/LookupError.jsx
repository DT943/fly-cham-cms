import { WarningCircle } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

/** Inline "booking not found" notice under the Find booking form. */
const LookupError = ({ error }) => {
  if (!error) return null

  return (
    <div role="alert" className="flex gap-3 rounded-lg bg-alert/10 px-4 py-3">
      <WarningCircle size={20} className="mt-0.5 shrink-0 text-alert" aria-hidden />
      <div className="flex flex-col gap-1">
        <p className={`${typography.caption} m-0 font-semibold text-800`}>{error.title}</p>
        <p className={`${typography.caption} m-0 text-600`}>{error.description}</p>
      </div>
    </div>
  )
}

export default LookupError
