import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerHref, socialStyle } from '../utils/footerStyle.js'
import { socialIcon } from '../utils/socialIcons.js'

/**
 * Footer social icons — outlined circular buttons, styled like flychamwebsite's
 * footer (32px → 40px from `sm`, 1px border in the icon colour, 18px brand
 * glyph, dims to 80% on hover).
 * Below `lg`, only links flagged `showOnMobile` render. From `lg` up, every link does.
 */
const SocialLink = ({ item, style }) => {
  const Icon = socialIcon(item.icon)
  const url = footerHref(item.href)

  return (
    <LocalizedLink
      href={url}
      aria-label={item.label || undefined}
      {...(/^https?:\/\//.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex size-8 shrink-0 items-center justify-center rounded-full border no-underline transition hover:opacity-80 focus-visible:opacity-80 sm:size-10"
      style={style}
    >
      <Icon size={18} className="block shrink-0" aria-hidden />
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
