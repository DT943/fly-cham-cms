import { Link, NavLink } from 'react-router-dom'
import { isInternalPath, withLanguage } from '../../i18n/languages.js'
import { toOfficialPath } from '../routing/utils/officialPath.js'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'

const LocalizedLink = ({ to, href, nav = false, ...props }) => {
  const language = useCurrentLanguage()
  const path = toOfficialPath(to ?? href)

  if (!isInternalPath(path)) {
    return <a href={path || '#'} {...props} />
  }

  const Component = nav ? NavLink : Link
  return <Component to={withLanguage(path, language)} {...props} />
}

export default LocalizedLink
