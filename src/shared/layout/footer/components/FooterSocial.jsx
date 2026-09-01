import { useTranslation } from 'react-i18next'
import { socialLinks } from '../utils/footerLinks.js'

const FooterSocial = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {socialLinks.map(({ id, icon: Icon, href }) => (
        <a
          key={id}
          href={href}
          aria-label={t(`layout.footer.social.${id}`)}
          className="w-9 h-9 rounded-full border border-secondary text-secondary grid place-items-center no-underline hover:bg-secondary/10 transition-colors"
        >
          <Icon size={22} weight="fill" />
        </a>
      ))}
    </div>
  )
}

export default FooterSocial
