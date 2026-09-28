import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_SOCIAL_HOVER, footerHref, footerIcon, socialStyle } from '../utils/footerStyle.js'

/**
 * Footer social icons — outlined circular buttons. Mobile shows only the
 * links flagged `showOnMobile`; every link appears from `lg` up.
 */
const FooterSocial = ({ social, style }) => {
  const itemStyle = socialStyle(style)

  return (
    <div className="flex flex-wrap items-center gap-2">
      {social.map(({ id, icon, label, href, showOnMobile }) => {
        const Icon = footerIcon(icon)
        return (
          <LocalizedLink
            key={id}
            href={footerHref(href)}
            aria-label={label || undefined}
            className={`${
              showOnMobile ? 'grid' : 'hidden lg:grid'
            } size-8 place-items-center rounded-full border no-underline transition-colors ${FTR_SOCIAL_HOVER} sm:size-9`}
            style={itemStyle}
          >
            <Icon size={16} weight="regular" />
          </LocalizedLink>
        )
      })}
    </div>
  )
}

export default FooterSocial
