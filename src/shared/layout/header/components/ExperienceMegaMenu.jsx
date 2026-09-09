import { ArrowRight, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { typography } from '../../../../styles/typography.js'
import Container from '../../../components/Container.jsx'
import LocalizedLink from '../../../components/LocalizedLink.jsx'
import { experienceMenu } from '../../headerNav.js'

const linkClass = `${typography.body} font-medium text-700 no-underline outline-none transition-colors hover:text-secondary-2 focus:outline-none focus-visible:outline-none`

const ExperienceColumn = ({ column, onNavigate }) => {
  const { t } = useTranslation()
  const imageBeside = column.image && !column.imageBelow

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <LocalizedLink
        to={column.href}
        onClick={onNavigate}
        className={`${typography.itemTitle} m-0 font-semibold text-secondary-2 no-underline outline-none focus:outline-none`}
      >
        {t(`layout.header.experience.columns.${column.id}`)}
      </LocalizedLink>

      <div className={`flex ${imageBeside ? 'flex-row items-start gap-4' : 'flex-col'}`}>
        {imageBeside && (
          <img
            src={column.image}
            alt=""
            className="h-44 w-28 shrink-0 rounded-xl object-cover sm:h-52 sm:w-32"
          />
        )}
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {column.links.map((link) => {
            const Icon = link.icon
            const href = column.href

            return (
              <li key={link.id}>
                <LocalizedLink to={href} onClick={onNavigate} className={`flex items-center gap-3 ${linkClass}`}>
                  {column.withIcons && Icon && (
                    <Icon size={18} weight="regular" className="shrink-0 text-secondary-2" />
                  )}
                  {t(`layout.header.experience.links.${link.id}`)}
                </LocalizedLink>
              </li>
            )
          })}
        </ul>
      </div>

      {column.image && column.imageBelow ? (
        <LocalizedLink
          to={column.href}
          onClick={onNavigate}
          className="mt-4 block h-32 overflow-hidden rounded-xl no-underline outline-none focus:outline-none"
        >
          <img src={column.image} alt="" className="size-full object-cover" />
        </LocalizedLink>
      ) : null}
    </div>
  )
}

const ExperienceMegaMenu = ({ onNavigate, embedded = false }) => {
  const { t } = useTranslation()
  const FooterIcon = experienceMenu.footer.icon

  return (
    <div className={`relative w-full bg-background ${embedded ? '' : 'shadow-[0_16px_40px_rgba(0,0,0,0.08)]'}`}>
      {!embedded && (
        <button
          type="button"
          onClick={onNavigate}
          aria-label={t('layout.header.closeMenu')}
          className="absolute end-4 top-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-600 outline-none hover:bg-100 hover:text-secondary-2 focus-visible:ring-2 focus-visible:ring-secondary"
        >
          <X size={18} weight="bold" />
        </button>
      )}

      <Container className={`flex flex-col gap-6 py-6 md:gap-8 md:py-8 ${embedded ? 'px-6 sm:px-6 md:px-6 xl:px-6' : ''}`}>
        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {experienceMenu.columns.map((column) => (
            <ExperienceColumn key={column.id} column={column} onNavigate={onNavigate} />
          ))}
        </div>
      </Container>

      <div className="border-t border-200 bg-100">
        <Container className={embedded ? 'px-6 sm:px-6 md:px-6 xl:px-6' : ''}>
          <LocalizedLink
            to={experienceMenu.footer.href}
            onClick={onNavigate}
            className="flex items-center gap-3 py-4 no-underline outline-none focus:outline-none sm:py-5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-200 bg-background text-secondary-2">
              <FooterIcon size={16} weight="regular" />
            </span>
            <span className={`${typography.caption} text-700`}>
              {t('layout.header.experience.footer.lead')}{' '}
              <span className="inline-flex items-center gap-1 font-semibold text-primary-1">
                {t('layout.header.experience.footer.action')}
                <ArrowRight size={12} weight="bold" className="rtl:-scale-x-100" />
              </span>
            </span>
          </LocalizedLink>
        </Container>
      </div>
    </div>
  )
}

export default ExperienceMegaMenu
