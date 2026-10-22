import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { FTR_HOVER_COLOR, footerHref, socialStyle } from '../utils/footerStyle.js'
import { socialIcon } from '../utils/socialIcons.js'

/**
 * flychamwebsite footer social buttons (components/Layout/Footer/FooterBrand.jsx):
 * 18px Simple Icons in 32px circles (40px from sm), 1px border in the icon
 * colour (CMS `socialColor`, default gold #d6b680), 8px apart, hover 80%
 * opacity. CMS array order is the display order; items without a link are
 * skipped, like the original.
 */
const SocialLink = ({ item, linkStyle }) => {
  const Icon = socialIcon(item.icon)
  const url = footerHref(item.href)

  return (
    <LocalizedLink
      href={url}
      aria-label={item.label || undefined}
      {...(/^https?:\/\//.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-current no-underline transition hover:opacity-80 focus-visible:opacity-80 sm:size-10 ${FTR_HOVER_COLOR}`}
      style={linkStyle}
    >
      <Icon size={18} className="block shrink-0" aria-hidden />
    </LocalizedLink>
  )
}

const FooterSocial = ({ social, style }) => {
  const items = social.filter((item) => item.href)
  const onMobile = items.filter((item) => item.showOnMobile)
  const linkStyle = socialStyle(style)

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2 md:hidden">
        {onMobile.map((item) => (
          <SocialLink key={item.id} item={item} linkStyle={linkStyle} />
        ))}
      </div>
      <div className="hidden flex-nowrap items-center gap-2 md:flex">
        {items.map((item) => (
          <SocialLink key={item.id} item={item} linkStyle={linkStyle} />
        ))}
      </div>
    </>
  )
}

export default FooterSocial
