"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { GlobeSimple } from "@phosphor-icons/react";
import {
  SiFacebook,
  SiInstagram,
  SiLinkedin,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiWhatsapp,
  SiX,
} from "react-icons/si";
import { useChamMilesContent } from "../shared/ChamMilesContent";

const FOOTER_LOGO = "/cham-miles/logo.png";

const ALLOWED_POS = ["iq", "om", "sy", "tr", "ae", "am", "kw", "ly", "gb"];
const ALLOWED_LANG = ["en", "ar"];
const DEFAULT_POS = "gb";
const DEFAULT_LANG = "en";

const iconMap = {
  facebook: { Icon: SiFacebook, label: "Facebook" },
  instagram: { Icon: SiInstagram, label: "Instagram" },
  whatsapp: { Icon: SiWhatsapp, label: "WhatsApp" },
  telegram: { Icon: SiTelegram, label: "Telegram" },
  tiktok: { Icon: SiTiktok, label: "TikTok" },
  linkedin: { Icon: SiLinkedin, label: "LinkedIn" },
  x: { Icon: SiX, label: "X" },
  threads: { Icon: SiThreads, label: "Threads" },
  twitter: { Icon: SiX, label: "X" },
};

/** Preferred display order for Cham Miles footer social icons. */
const SOCIAL_ICON_ORDER = [
  "facebook",
  "instagram",
  "whatsapp",
  "telegram",
  "tiktok",
  "linkedin",
  "x",
  "twitter",
  "threads",
];

const FALLBACK_SOCIAL_LINKS = [
  {
    icon: "facebook",
    href: "https://www.facebook.com/people/%D9%81%D9%84%D8%A7%D9%8A-%D8%B4%D8%A7%D9%85-Fly-Cham/61575817032233/",
  },
  { icon: "instagram", href: "https://www.instagram.com/fly.cham/" },
  { icon: "whatsapp", href: "https://www.whatsapp.com/channel/0029Vb61PQ2HQbS4UsXPC83a" },
  { icon: "telegram", href: "https://t.me/flychamchannel" },
  { icon: "tiktok", href: "https://www.tiktok.com/@flycham" },
  { icon: "linkedin", href: "https://www.linkedin.com/company/fly-cham/" },
  { icon: "x", href: "https://x.com/fly_cham" },
  { icon: "threads", href: "https://www.threads.com/@fly.cham" },
];

function sortSocialLinks(links) {
  const rank = (icon) => {
    const i = SOCIAL_ICON_ORDER.indexOf(icon);
    return i === -1 ? SOCIAL_ICON_ORDER.length : i;
  };
  return [...links].sort((a, b) => rank(a.icon) - rank(b.icon));
}

function useFooterLang() {
  const pathname = usePathname();
  return useMemo(() => {
    const segments = (pathname || "").split("/").filter(Boolean);
    return ALLOWED_LANG.includes(segments[1]) ? segments[1] : DEFAULT_LANG;
  }, [pathname]);
}

function useLocalePrefix() {
  const pathname = usePathname();
  return useMemo(() => {
    const segments = (pathname || "").split("/").filter(Boolean);
    const pos = ALLOWED_POS.includes(segments[0]) ? segments[0] : DEFAULT_POS;
    const lang = ALLOWED_LANG.includes(segments[1]) ? segments[1] : DEFAULT_LANG;
    const base = `/${pos}/${lang}`;
    const withPrefix = (path) => {
      if (!path || typeof path !== "string") return path || "";
      const trimmed = path.trim();
      if (/^(https?:|mailto:|tel:|#)/i.test(trimmed)) return trimmed;
      if (!trimmed.startsWith("/")) return trimmed;
      return `${base}${trimmed}`;
    };
    return { base, withPrefix, homeHref: base };
  }, [pathname]);
}

function useFooterContent() {
  const lang = useFooterLang();
  const footerData = useSelector((state) => state.layout?.footer);

  return useMemo(() => {
    const translations = footerData?.translations;
    if (!Array.isArray(translations) || translations.length === 0) return null;
    const normalizedLang = lang?.toLowerCase();
    const byCode = translations.find((trans) => {
      const code = trans?.languageCode?.toLowerCase();
      return code === normalizedLang || code?.startsWith(`${normalizedLang}-`);
    });
    return byCode?.content ?? null;
  }, [footerData, lang]);
}

export default function ChamMilesFormFooter() {
  const year = new Date().getFullYear();
  const { withPrefix, homeHref } = useLocalePrefix();
  const footerContent = useFooterContent();
  const { formFooter, a11y } = useChamMilesContent();

  const copyright =
    footerContent?.row3?.col1?.copyright || formFooter.copyright(year);

  const bottomLinks = useMemo(() => {
    const items = footerContent?.row3?.col2?.Items;
    if (Array.isArray(items) && items.length > 0) {
      return items
        .map((item) => ({
          label: item.text,
          href: withPrefix(item.link || ""),
        }))
        .filter((link) => link.label && link.href);
    }
    return formFooter.legalLinks.map((link) => ({
      ...link,
      href: withPrefix(link.href),
    }));
  }, [footerContent, formFooter.legalLinks, withPrefix]);

  const socialLinks = useMemo(() => {
    const cms = footerContent?.row1?.col2?.socialLinks;
    if (Array.isArray(cms) && cms.length > 0) {
      return sortSocialLinks(
        cms
          .map((social, index) => ({
            key: `${social?.icon || "social"}-${index}`,
            href: social?.link || "",
            icon: (social?.icon || "").toLowerCase().trim(),
          }))
          .filter((social) => social.href),
      );
    }
    return FALLBACK_SOCIAL_LINKS.map((social, index) => ({
      key: `${social.icon}-${index}`,
      href: social.href,
      icon: social.icon,
    }));
  }, [footerContent]);

  return (
    <footer className="cm-form-footer w-full shrink-0 bg-(--cm-footer-bg) text-(--cm-footer-text)">
      <div className="cm-form-footer__inner mx-auto w-full max-w-[1440px] px-4 lg:px-8">
        <div className="cm-form-footer__row">
          <div className="cm-form-footer__brand">
            <Link
              href={homeHref}
              aria-label={a11y.flyChamHome}
              className="cm-form-footer__logo-link"
            >
              <img
                src={FOOTER_LOGO}
                alt="Fly Cham"
                width={180}
                height={40}
                className="cm-form-footer__logo"
                decoding="async"
              />
            </Link>
            <p className="cm-form-footer__copyright">{copyright}</p>
          </div>

          <nav aria-label={formFooter.legalNavAriaLabel} className="cm-form-footer__legal">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="cm-form-footer__social">
            {socialLinks.map((social) => {
              const mapped = iconMap[social.icon];
              const IconComp = mapped?.Icon || GlobeSimple;
              const label = mapped?.label || "Social";
              return (
                <Link
                  key={social.key}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                  aria-label={label}
                  className="cm-form-footer__social-btn"
                >
                  <IconComp size={11} aria-hidden />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
