import { Navigate } from 'react-router-dom'

const HomeRedirect = ({ language }) => (
  <Navigate to={`/${language}`} replace />
)

export default HomeRedirect
