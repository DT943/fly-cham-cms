import { useTranslation } from 'react-i18next'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerLinkHrefs, footerLinkMeta } from '../utils/footerLinks.js'

const FooterLinkList = ({ columnId, links }) => {
  const { t } = useTranslation()

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {links.map((linkId) => {
        const href = footerLinkHrefs[linkId] || '#'
        const label = t(`layout.footer.columns.${columnId}.links.${linkId}`)
        const meta = footerLinkMeta[linkId] || {}
        const highlight = meta.highlight
        const external = meta.external
        const className = highlight
          ? `${typography.caption} inline-flex items-center gap-1.5 font-semibold text-primary-2 no-underline transition-colors hover:text-50`
          : `${typography.caption} inline-flex items-center gap-1.5 text-50 no-underline transition-colors hover:text-primary-2`

        return (
          <li key={linkId}>
            <LocalizedLink
              href={href}
              className={className}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {label}
              {external ? (
                <ArrowSquareOut size={14} weight="regular" aria-hidden className="shrink-0" />
              ) : null}
            </LocalizedLink>
          </li>
        )
      })}
    </ul>
  )
}

export default FooterLinkList
