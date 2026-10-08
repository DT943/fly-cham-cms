import { Navigate } from 'react-router-dom'
import { withLanguage } from '../../../i18n/languages.js'

const HomeRedirect = ({ language }) => (
  <Navigate to={withLanguage('/', language)} replace />
)

export default HomeRedirect
