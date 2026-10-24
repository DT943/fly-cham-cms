import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerHref, socialStyle } from '../utils/footerStyle.js'
import { socialIcon } from '../utils/socialIcons.js'

const FooterSocial = ({ social, style }) => (
  <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:gap-2.5">
    {social.map((item) => {
      const Icon = socialIcon(item.icon)
      const url = footerHref(item.href)
      return (
        <LocalizedLink
          key={item.id}
          href={url}
          aria-label={item.label || undefined}
          {...(/^https?:\/\//.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`${item.showOnMobile ? 'flex' : 'hidden md:flex'} size-[32px] shrink-0 items-center justify-center rounded-full border no-underline transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:size-[36px] md:size-[39px]`}
          style={socialStyle(style)}
        >
          <Icon size={20} weight="fill" className="block shrink-0" aria-hidden />
        </LocalizedLink>
      )
    })}
  </div>
)

export default FooterSocial
