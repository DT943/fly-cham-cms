import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import { footerLinkHrefs } from '../utils/footerLinks.js'

const FooterLinkList = ({ columnId, links }) => {
  const { t } = useTranslation()

  return (
    <ul className="list-none m-0 p-0 flex flex-col gap-1">
      {links.map((linkId) => {
        const href = footerLinkHrefs[linkId] || '#'
        const label = t(`layout.footer.columns.${columnId}.links.${linkId}`)
        const className = `${typography.caption} text-50 no-underline hover:text-secondary`

        return (
          <li key={linkId}>
            {href.startsWith('/') ? (
              <Link to={href} className={className}>
                {label}
              </Link>
            ) : (
              <a href={href} className={className}>
                {label}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default FooterLinkList
