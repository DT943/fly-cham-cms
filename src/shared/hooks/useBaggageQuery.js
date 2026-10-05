import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * The Baggage Calculator's choices from the URL (`?from=&to=&class=&tier=`),
 * written by the calculator's Calculate link and read by the result blocks
 * (route summary, allowance breakdown, add-ons). `calculated` is true once a
 * route is present.
 */
export default function useBaggageQuery() {
  const { search } = useLocation()
  return useMemo(() => {
    const params = new URLSearchParams(search || '')
    const values = {
      from: params.get('from') || '',
      to: params.get('to') || '',
      class: params.get('class') || '',
      tier: params.get('tier') || '',
    }
    return { ...values, calculated: Boolean(values.from && values.to) }
  }, [search])
}
