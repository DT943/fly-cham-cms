import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/images/layout/logo.png'
import Container from '../components/Container.jsx'
import { typography } from '../../styles/typography.js'
import { footerColumns, footerLegal, footerLinkHrefs, socialLinks } from './footerLinks.js'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="bg-[#054E72] text-50">
      <Container className="py-10 md:py-14 flex flex-col gap-10 md:gap-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" aria-label="Fly Cham">
            <img src={logo} alt="Fly Cham" className="h-9 md:h-11 w-auto " />
          </Link>
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-6">
          {footerColumns.map((column) => (
            <FooterColumn key={column.id} column={column} />
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-6 border-t border-secondary/40">
          <p className={`${typography.caption} m-0 text-50`}>
            {t('layout.footer.copyright')}
          </p>
          <ul className="list-none m-0 p-0 flex flex-wrap items-center gap-4 md:gap-6">
            {footerLegal.map((id) => (
              <li key={id}>
                <a href="#" className={`${typography.caption} text-50 no-underline hover:text-secondary`}>
                  {t(`layout.footer.legal.${id}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}

const FooterColumn = ({ column }) => {
  const { t } = useTranslation()
  const sections = column.sections || [{ links: column.links }]

  return (
    <div className="flex flex-col gap-4">
      <h2 className={`${typography.caption} font-semibold text-secondary m-0`}>
        {t(`layout.footer.columns.${column.id}.title`)}
      </h2>
      {sections.map((section, index) => (
        <div key={section.titleId || `${column.id}-${index}`} className="flex flex-col gap-3">
          {section.titleId && (
            <h3 className={`${typography.caption} font-semibold text-secondary m-0`}>
              {t(`layout.footer.columns.${column.id}.sections.${section.titleId}`)}
            </h3>
          )}
          <FooterLinkList columnId={column.id} links={section.links} />
        </div>
      ))}
    </div>
  )
}

const FooterLinkList = ({ columnId, links }) => {
  const { t } = useTranslation()

  return (
    <ul className="list-none m-0 p-0 flex flex-col gap-2">
      {links.map((linkId) => {
        const href = footerLinkHrefs[linkId] || '#'
        const label = t(`layout.footer.columns.${columnId}.links.${linkId}`)
        const className = `${typography.caption} text-50 no-underline hover:text-secondary`

        return (
          <li key={linkId}>
            {href.startsWith('/') ? (
              <Link to={href} className={className}>
                {label}
              </Link>
            ) : (
              <a href={href} className={className}>
                {label}
              </a>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default Footer
