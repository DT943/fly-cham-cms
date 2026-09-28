import { useTranslation } from 'react-i18next'
import { footerMobileSocialIds, socialLinks } from '../utils/footerLinks.js'

/**
 * Footer social icons — outlined circular buttons. Mobile shows the four
 * primary networks; the rest appear from `lg` up.
 */
const FooterSocial = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {socialLinks.map(({ id, icon: Icon, href }) => (
        <a
          key={id}
          href={href}
          aria-label={t(`layout.footer.social.${id}`)}
          className={`${
            footerMobileSocialIds.includes(id) ? 'grid' : 'hidden lg:grid'
          } size-8 place-items-center rounded-full border border-50/70 text-50 no-underline transition-colors hover:border-primary-2 hover:bg-primary-2/15 hover:text-primary-2 sm:size-9`}
        >
          <Icon size={16} weight="regular" />
        </a>
      ))}
    </div>
  )
}

export default FooterSocial
