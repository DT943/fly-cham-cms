import { useTranslation } from 'react-i18next'
import { ArrowLeft } from '@phosphor-icons/react'
import Container from '../../shared/components/Container.jsx'
import LocalizedLink from '../../shared/components/LocalizedLink.jsx'
import MediaNewsletterSignup from '../../shared/components/MediaNewsletterSignup.jsx'
import { typography } from '../../styles/typography.js'
import planeImage from '../../assets/images-webp/coming-soon/plane.webp'

const NEWSLETTER_PATTERN =
  'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/media-newsletter/pattern.png'

const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <main className="flex w-full flex-1 flex-col bg-100">
      <Container className="flex flex-col items-center pt-12 text-center md:pt-20">
        <h1 className={`m-0 font-semibold leading-tight text-700 ${typography.pageTitle}`}>
          {t('comingSoon.title')}
        </h1>
        <p className="m-0 mt-4 max-w-140 whitespace-pre-line text-sm leading-relaxed text-700 md:text-base">
          {t('comingSoon.description')}
        </p>
        <LocalizedLink
          href="/"
          className={`mt-6 inline-flex h-11 items-center gap-3 rounded-lg bg-primary-1 px-5 text-50 no-underline transition-colors hover:bg-primary-800 md:h-12 md:px-6 ${typography.button}`}
        >
          <ArrowLeft size={16} weight="bold" className="rtl:-scale-x-100" aria-hidden />
          {t('comingSoon.backHome')}
        </LocalizedLink>

        <img
          src={planeImage}
          alt={t('comingSoon.imageAlt')}
          className="mt-8 block h-auto w-full max-w-140 md:mt-6"
        />
      </Container>

      <div className="border-y border-solid border-200 py-6 md:py-8">
        <MediaNewsletterSignup
          title={t('mediaCenter.newsletter.title')}
          description={t('mediaCenter.newsletter.description')}
          label={t('mediaCenter.newsletter.label')}
          placeholder={t('mediaCenter.newsletter.placeholder')}
          cta={t('mediaCenter.newsletter.cta')}
          pattern={NEWSLETTER_PATTERN}
        />
      </div>
    </main>
  )
}

export default ComingSoon
