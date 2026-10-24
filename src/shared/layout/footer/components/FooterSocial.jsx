import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerHref, socialStyle } from '../utils/footerStyle.js'
import { socialIcon } from '../utils/socialIcons.js'
import { FaFacebook, FaInstagram, FaWhatsapp, FaTelegram, FaXTwitter, FaYoutube, FaLinkedin, FaThreads, FaTiktok } from 'react-icons/fa6'

const BRAND_ICONS = {
  FacebookLogo: FaFacebook, InstagramLogo: FaInstagram, WhatsappLogo: FaWhatsapp,
  TelegramLogo: FaTelegram, PaperPlaneTilt: FaTelegram, XLogo: FaXTwitter,
  YoutubeLogo: FaYoutube, LinkedinLogo: FaLinkedin, ThreadsLogo: FaThreads, TiktokLogo: FaTiktok,
}

const FooterSocial = ({ social, style }) => (
  <div className="flex w-full min-w-0 flex-wrap items-center gap-1.5">
    {social.map((item) => {
      const Icon = BRAND_ICONS[item.icon] || socialIcon(item.icon)
      const url = footerHref(item.href)
      return (
        <LocalizedLink
          key={item.id}
          href={url}
          aria-label={item.label || undefined}
          {...(/^https?:\/\//.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={`${item.showOnMobile ? 'flex' : 'hidden md:flex'} size-[32px] shrink-0 items-center justify-center rounded-full border no-underline transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
          style={socialStyle(style)}
        >
          <Icon size={14} className="block shrink-0" aria-hidden />
        </LocalizedLink>
      )
    })}
  </div>
)

export default FooterSocial
