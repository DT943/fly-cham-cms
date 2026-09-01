import { useEffect, useState } from 'react'
import { countryIds, getCountryById } from '../utils/gsaLocations.js'

function useGsaSelection(defaultCountryId = countryIds[0]) {
  const [countryId, setCountryId] = useState(defaultCountryId)
  const locationIds = getCountryById(countryId)?.locationIds ?? []
  const [officeId, setOfficeId] = useState(locationIds[0])

  useEffect(() => {
    const nextIds = getCountryById(countryId)?.locationIds ?? []
    setOfficeId(nextIds[0])
  }, [countryId])

  return {
    countryId,
    setCountryId,
    locationIds,
    officeId,
    setOfficeId,
  }
}

export default useGsaSelection
