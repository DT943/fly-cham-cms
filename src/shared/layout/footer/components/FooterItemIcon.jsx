import { footerIcon } from '../utils/footerStyle.js'

/** Optional Phosphor icon on a footer section title or link ("" = none). */
const FooterItemIcon = ({ name }) => {
  if (!name) return null
  const Icon = footerIcon(name)
  return <Icon size="1.15em" weight="regular" aria-hidden className="shrink-0" />
}

export default FooterItemIcon
