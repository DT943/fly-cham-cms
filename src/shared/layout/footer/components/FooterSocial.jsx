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
          className="grid size-9 place-items-center rounded-full border border-primary-2/70 text-primary-2 no-underline transition-colors hover:border-primary-2 hover:bg-primary-2/15 hover:text-50"
        >
          <Icon size={18} weight="fill" />
        </a>
      ))}
    </div>
  )
}

export default FooterSocial
