import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { footerHref } from '../utils/footerStyle.js'
import { socialIcon } from '../utils/socialIcons.js'

/** Figma order: WhatsApp → Instagram → Facebook → Telegram → TikTok → YouTube → X → LinkedIn */
const FIGMA_ORDER = [
  'whatsapp',
  'instagram',
  'facebook',
  'telegram',
  'tiktok',
  'youtube',
  'x',
  'linkedin',
]

const sortSocial = (social) => {
  const rank = new Map(FIGMA_ORDER.map((id, index) => [id, index]))
  return [...social]
    .sort((a, b) => {
      const ra = rank.has(a.id) ? rank.get(a.id) : 100
      const rb = rank.has(b.id) ? rank.get(b.id) : 100
      return ra - rb
    })
    .filter((item) => FIGMA_ORDER.includes(item.id))
}

/**
 * Figma social: ~39px circles, #f4f4f4 border, Phosphor regular glyphs (~20px).
 */
const SocialLink = ({ item }) => {
  const Icon = socialIcon(item.icon)
  const url = footerHref(item.href)

  return (
    <LocalizedLink
      href={url}
      aria-label={item.label || undefined}
      {...(/^https?:\/\//.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-100 text-50 no-underline transition hover:opacity-80 focus-visible:opacity-80 sm:size-[36px] md:size-[39px]"
    >
      <Icon size={20} weight="regular" className="block shrink-0" aria-hidden />
    </LocalizedLink>
  )
}

const FooterSocial = ({ social }) => {
  const ordered = sortSocial(social)
  const onMobile = ordered.filter((item) => item.showOnMobile)

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2 sm:gap-2.5 md:hidden">
        {onMobile.map((item) => (
          <SocialLink key={item.id} item={item} />
        ))}
      </div>
      <div className="hidden flex-nowrap items-center gap-[17px] md:flex">
        {ordered.map((item) => (
          <SocialLink key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}

export default FooterSocial
