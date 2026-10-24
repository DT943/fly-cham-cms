import { ArrowUp } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { colorVar } from '../../../../styles/cmsStyle.js'
import FooterSocial from './FooterSocial.jsx'

const APP_STORE_URL = 'https://apps.apple.com/app/flycham'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.flycham'

/**
 * Figma 41944:18895 apps row:
 * [Download + badges side-by-side] …… [social] …… [back-to-top]
 */
const FooterApps = ({ social, style }) => {
  const { t, i18n } = useTranslation()
  const badgeLanguage = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('ar') ? 'ar' : 'en'

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-10 md:gap-y-5 lg:flex-nowrap xl:gap-x-[min(19.7rem,12vw)]">
        {/* Keep the three store images together, scaling down as one row on narrow screens. */}
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 md:gap-7 lg:gap-9">
          <p className="m-0 shrink-0 text-[14px] font-medium leading-normal text-50 sm:text-[15px] md:text-[16px]">
            {t('layout.footer.downloadApp')}
          </p>
          <div
            className="grid w-[413px] min-w-0 max-w-full items-center gap-3"
            style={{ gridTemplateColumns: 'minmax(0, 119.66407fr) minmax(0, 134.87371fr) minmax(0, 134.28571fr)' }}
          >
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-50"
            >
              <img loading="lazy" decoding="async"
                src="/images/footer/app-store-en.svg"
                alt={t('layout.footer.appStore')}
                width={120}
                height={40}
                className="block h-auto w-full"
              />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-50"
            >
              <img loading="lazy" decoding="async"
                src={`/images/footer/google-play-${badgeLanguage}.svg`}
                alt={t('layout.footer.googlePlay')}
                width={135}
                height={40}
                className="block h-auto w-full"
              />
            </a>
            <img
              loading="lazy"
              decoding="async"
              src="/images/footer/huawei-appgallery-badge.svg"
              alt={badgeLanguage === 'ar' ? 'هواوي AppGallery' : 'Huawei AppGallery'}
              width={134}
              height={40}
              className="block h-auto w-full"
            />
          </div>
        </div>

        {social.length > 0 ? (
          <div className="min-w-0 shrink-0">
            <FooterSocial social={social} />
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={scrollTop}
        aria-label={t('layout.footer.backToTop')}
        className="ms-auto flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 text-secondary-2 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-50 sm:size-[44px] md:ms-0"
        style={{ backgroundColor: colorVar(style?.backToTopBg || 'primary-3') }}
      >
        <ArrowUp size={20} weight="bold" aria-hidden />
      </button>
    </div>
  )
}

export default FooterApps
