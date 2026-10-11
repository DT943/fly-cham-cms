import { GenIcon } from 'react-icons'
import {
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from 'react-icons/si'
import { footerIcon } from './footerStyle.js'

/**
 * Footer social glyphs — the Simple Icons set flychamwebsite's footer uses
 * (components/Layout/Footer/FooterBrand.jsx). The CMS stores Phosphor names;
 * the brand ones render their Simple Icon, any other name keeps its Phosphor
 * glyph.
 *
 * Keep in sync with the admin copy at
 * flychamadmin/src/cms2/components/footer/socialIcons.js
 */

// react-icons 5.7 no longer ships SiLinkedin — this is the 5.5 icon tree
// flychamwebsite renders.
const SiLinkedin = GenIcon({"tag":"svg","attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"},"child":[]}]})

const BRAND_ICONS = {
  FacebookLogo: SiFacebook,
  InstagramLogo: SiInstagram,
  WhatsappLogo: SiWhatsapp,
  TelegramLogo: SiTelegram,
  XLogo: SiX,
  TwitterLogo: SiX,
  YoutubeLogo: SiYoutube,
  LinkedinLogo: SiLinkedin,
  ThreadsLogo: SiThreads,
  TiktokLogo: SiTiktok,
}

/** Stored icon name → brand (Simple Icons) component, else its Phosphor icon. */
export const socialIcon = (name) => BRAND_ICONS[name] || footerIcon(name)
