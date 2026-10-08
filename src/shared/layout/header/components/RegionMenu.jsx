import { GlobeHemisphereWest } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { replaceLanguage } from '../../../../i18n/languages.js'
import { typography } from '../../../../styles/typography.js'
import Container from '../../../components/Container.jsx'
import useCurrentLanguage from '../../../hooks/useCurrentLanguage.js'
import useCurrentPos from '../../../hooks/useCurrentPos.js'
import { regions } from '../menuData.js'

const RegionMenu = ({ onNavigate, embedded = false }) => {
  const { t } = useTranslation()
  const { pathname, search, hash } = useLocation()
  const currentLanguage = useCurrentLanguage()
  const currentPos = useCurrentPos()

  // Same page, only the POS and language in the URL change.
  const toLocale = (lang, pos) => `${replaceLanguage(pathname, lang, pos)}${search}${hash}`

  return (
    <div
      className={`w-full border-b-2 border-200 bg-50 ${
        embedded ? '' : 'shadow-[0_4px_16px_rgba(33,37,41,0.08)]'
      }`}
    >
      <Container className={`py-8 ${embedded ? 'px-0 sm:px-0 md:px-0 xl:px-0' : ''}`}>
        <p className={`${typography.itemTitle} m-0 font-medium text-700`}>
          {t('layout.header.regionTitle')}
        </p>
        <div className="mt-4 border-t border-200" />

        <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-6 p-0 pt-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {regions.map((region) => (
            <li key={region.id} className="flex items-center gap-2.5">
              <span className="flex h-6 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[3px]">
                {region.global ? (
                  <GlobeHemisphereWest size={28} weight="regular" className="text-700" />
                ) : (
                  <img src={region.flag} alt="" className="size-full object-cover" />
                )}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className={`${typography.body} font-medium text-700`}>
                  {t(`layout.header.regions.${region.id}`)}
                </span>
                <span className={`${typography.caption} flex items-center gap-1 text-700`}>
                  {region.langs.map((lang, index) => {
                    const pos = region.code.toLowerCase()
                    const active = pos === currentPos && lang === currentLanguage
                    return (
                      <span key={lang} className="flex items-center gap-1">
                        {index > 0 && <span aria-hidden="true">·</span>}
                        <Link
                          to={toLocale(lang, pos)}
                          onClick={onNavigate}
                          aria-current={active ? 'true' : undefined}
                          className={`no-underline ${
                            active ? 'font-semibold text-primary-1' : 'text-700 hover:text-primary-1'
                          }`}
                        >
                          {t(`layout.header.langNames.${lang}`)}
                        </Link>
                      </span>
                    )
                  })}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  )
}

export default RegionMenu
