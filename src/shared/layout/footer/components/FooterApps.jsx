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
  const { t } = useTranslation()

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
      <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-10 md:gap-y-5 lg:flex-nowrap xl:gap-x-[min(19.7rem,12vw)]">
        {/* Download label + store badges stay on one horizontal row (Figma) */}
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 md:gap-7 lg:gap-9">
          <p className="m-0 shrink-0 text-[14px] font-medium leading-normal text-50 sm:text-[15px] md:text-[16px]">
            {t('layout.footer.downloadApp')}
          </p>
          <div className="flex shrink-0 flex-nowrap items-center gap-3 sm:gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-50"
            >
              <img loading="lazy" decoding="async"
                src="/images/footer/app-store.png"
                alt={t('layout.footer.appStore')}
                width={134}
                height={38}
                className="block h-[38px] w-[134px] object-contain"
              />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-50"
            >
              <img loading="lazy" decoding="async"
                src="/images/footer/google-play.png"
                alt={t('layout.footer.googlePlay')}
                width={134}
                height={38}
                className="block h-[38px] w-[134px] object-contain"
              />
            </a>
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
