import { useEffect, useState } from 'react'
import { FLYCHAM_SITE_URL, useFlyChamLocalePrefix } from '../../vendor/flycham/lib/flychamSite.js'

/**
 * Manage tab: same rules and hand-off as the live booking box's ManageTap —
 * a 6-character PNR + an English last name, then flycham.com's manage-booking
 * deep link `/{pos}/{lang}/manage-booking/{PNR}/{LASTNAME}` runs the lookup.
 */
export default function useManageBooking(labels) {
  const localePrefix = useFlyChamLocalePrefix()
  const [pnr, setPnr] = useState('')
  const [lastName, setLastName] = useState('')
  const [errors, setErrors] = useState({})
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) setRedirecting(false)
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const onPnrChange = (value) => {
    setPnr(value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
    setErrors((current) => ({ ...current, pnr: undefined }))
  }

  const onLastNameChange = (value) => {
    setLastName(value.replace(/[^A-Za-z\s]/g, '').replace(/\s+/g, ' ').trimStart().toUpperCase())
    setErrors((current) => ({ ...current, lastName: undefined }))
  }

  const submit = (event) => {
    event?.preventDefault()
    const next = {}
    if (pnr.trim().length < 6) next.pnr = labels.pnrError
    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(lastName.trim())) next.lastName = labels.lastNameError
    setErrors(next)
    if (Object.keys(next).length) return
    setRedirecting(true)
    window.location.assign(
      `${FLYCHAM_SITE_URL}${localePrefix}/manage-booking/${encodeURIComponent(pnr.trim())}/${encodeURIComponent(lastName.trim())}`,
    )
  }

  return { pnr, lastName, errors, redirecting, onPnrChange, onLastNameChange, submit }
}
