import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import LocalizedLink from '../../../components/LocalizedLink.jsx'

const MegaMenuLink = ({ icon: Icon, title, description, href, onNavigate }) => (
  <LocalizedLink
    to={href}
    onClick={onNavigate}
    className="group flex items-start gap-3 no-underline text-inherit py-3 pe-6 rounded-lg hover:bg-background/70 outline-none focus:outline-none focus-visible:outline-none"
  >
    <Icon size={22} weight="regular" className="shrink-0 text-secondary-2 mt-0.5" />
    <span className="flex flex-col gap-0.5 min-w-0">
      <span className={`${typography.body} font-bold text-secondary-2`}>
        {title}
      </span>
      <span className={`${typography.caption} text-600 leading-snug`}>
        {description}
      </span>
    </span>
  </LocalizedLink>
)

const MegaMenuCta = ({ title, description, action, href, onNavigate }) => (
  <div className="bg-secondary-2 rounded-xl p-6 md:p-7 h-full flex flex-col justify-between gap-8 min-h-45">
    <div className="flex flex-col gap-4">
      <span className="block w-10 h-0.5 bg-secondary" aria-hidden="true" />
      <h3 className={`${typography.itemTitle} font-bold text-50 m-0`}>
        {title}
      </h3>
      <p className={`${typography.caption} text-50/80 m-0 leading-relaxed`}>
        {description}
      </p>
    </div>
    <LocalizedLink
      to={href}
      onClick={onNavigate}
      className={`${typography.caption} font-medium text-50 underline underline-offset-4 decoration-50/70 flex items-center gap-2 w-fit outline-none focus:outline-none focus-visible:outline-none`}
    >
      {action}
      <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" />
    </LocalizedLink>
  </div>
)

const MegaMenuQuickLinks = ({ links, onNavigate }) => {
  const { t } = useTranslation()

  return (
    <div className="border-t border-200 grid grid-cols-1 md:grid-cols-2">
      {links.map((link, index) => {
        const Icon = link.icon

        return (
          <LocalizedLink
            key={link.id}
            to={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 no-underline text-inherit py-4 md:py-5 hover:bg-background/70 outline-none focus:outline-none focus-visible:outline-none ${
              index === 0 ? 'md:pe-6 md:border-e md:border-200' : 'md:ps-6'
            }`}
          >
            <span className="w-9 h-9 rounded-full border border-200 flex items-center justify-center shrink-0 text-secondary-2">
              <Icon size={16} weight="regular" />
            </span>
            <span className="flex flex-col min-w-0 flex-1">
              <span className={`${typography.body} font-bold text-secondary-2`}>
                {t(`layout.header.mega.quick.${link.id}.title`)}
              </span>
              <span className={`${typography.caption} text-600`}>
                {t(`layout.header.mega.quick.${link.id}.description`)}
              </span>
            </span>
            <ArrowRight size={16} weight="bold" className="shrink-0 text-700 rtl:-scale-x-100" />
          </LocalizedLink>
        )
      })}
    </div>
  )
}

const HelpMegaMenu = ({ panels, activeId, onSelectPanel, onNavigate }) => {
  const { t } = useTranslation()
  const panel = panels.find((item) => item.id === activeId) || panels[0]

  return (
    <div className="w-full bg-background shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col lg:flex-row lg:items-stretch w-full">
        <nav
          aria-label={t('layout.header.mega.panelsLabel')}
          className="bg-100 w-full lg:w-72 xl:w-80 shrink-0 flex lg:flex-col"
        >
          {panels.map((item) => {
            const Icon = item.icon
            const isActive = item.id === panel.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPanel(item.id)}
                className={`relative flex-1 lg:flex-none flex items-center gap-3 px-4 md:px-6 lg:px-8 py-3.5 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer text-start ${
                  isActive ? 'text-secondary-2' : 'text-700 hover:text-secondary-2'
                }`}
              >
                {isActive && (
                  <span className="absolute inset-s-0 top-2 bottom-2 w-0.75 bg-secondary rounded-full" />
                )}
                <span className="w-8 h-8 rounded-full border border-200 bg-background flex items-center justify-center shrink-0">
                  <Icon size={16} weight="regular" />
                </span>
                <span className={`${typography.body} font-semibold`}>
                  {t(`layout.header.mega.panels.${item.id}`)}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="flex-1 min-w-0 flex flex-col w-full px-4 sm:px-8 md:px-10">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] gap-6 lg:gap-10 py-5 md:py-6 items-stretch">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 content-start w-full">
              {panel.links.map((link) => (
                <MegaMenuLink
                  key={link.id}
                  icon={link.icon}
                  href={link.href}
                  title={t(`layout.header.mega.links.${link.id}.title`)}
                  description={t(`layout.header.mega.links.${link.id}.description`)}
                  onNavigate={onNavigate}
                />
              ))}
            </div>

            <MegaMenuCta
              title={t(`layout.header.mega.cta.${panel.id}.title`)}
              description={t(`layout.header.mega.cta.${panel.id}.description`)}
              action={t(`layout.header.mega.cta.${panel.id}.action`)}
              href={panel.ctaHref}
              onNavigate={onNavigate}
            />
          </div>

          <MegaMenuQuickLinks links={panel.quickLinks} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  )
}

export default HelpMegaMenu
