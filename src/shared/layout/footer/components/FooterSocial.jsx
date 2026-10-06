import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_SOCIAL_HOVER, footerHref, footerIcon, socialStyle } from '../utils/footerStyle.js'

/**
 * Footer social icons — outlined circular buttons.
 * Below `lg`, only links flagged `showOnMobile` render. From `lg` up, every link does.
 */
const SocialLink = ({ item, style }) => {
  const Icon = footerIcon(item.icon)
  const url = footerHref(item.href)

  return (
    <LocalizedLink
      href={url}
      aria-label={item.label || undefined}
      {...(/^https?:\/\//.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`grid size-10 shrink-0 place-items-center rounded-full border no-underline transition-colors ${FTR_SOCIAL_HOVER}`}
      style={style}
    >
      <Icon size={20} weight="regular" className="block shrink-0" aria-hidden />
    </LocalizedLink>
  )
}

const FooterSocial = ({ social, style }) => {
  const itemStyle = socialStyle(style)
  const onMobile = social.filter((item) => item.showOnMobile)

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2 lg:hidden">
        {onMobile.map((item) => (
          <SocialLink key={item.id} item={item} style={itemStyle} />
        ))}
      </div>
      <div className="hidden items-center gap-2 lg:flex lg:w-max lg:flex-nowrap">
        {social.map((item) => (
          <SocialLink key={item.id} item={item} style={itemStyle} />
        ))}
      </div>
    </>
  )
}

export default FooterSocial
