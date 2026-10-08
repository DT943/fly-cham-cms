import { useLocation } from 'react-router-dom'
import { DEFAULT_POS, getPosFromPath } from '../../i18n/languages.js'

/** The POS (country code, e.g. `sy`, `ae`) in the current URL. */
const useCurrentPos = () => {
  const { pathname } = useLocation()
  return getPosFromPath(pathname) || DEFAULT_POS
}

export default useCurrentPos
