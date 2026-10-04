import { useTranslation } from 'react-i18next'
import Container from '../../shared/components/Container.jsx'
import { typography } from '../../styles/typography.js'
// Unrouted legacy page (now the CMS coming-soon-hero block) — cms-media copy.
const heroImage = 'https://xbqrfakpcisqunyugrqt.supabase.co/storage/v1/object/public/cms-media/coming-soon/hero.webp'

/**
 * Full-bleed Coming Soon: Fly Cham aircraft over clouds, navy overlay
 * (#01263B at 40%), title and supporting copy aligned top-start.
 */
const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <main className="relative flex min-h-dvh w-full flex-1 overflow-hidden -mt-16 pt-16 md:-mt-18 md:pt-18">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={t('comingSoon.imageAlt')}
          className="object-cover w-full h-full"
        />
        {/* Design overlay: #01263B66 */}
        <div className="absolute inset-0 bg-[#000000]/20" aria-hidden />
      </div>

      <Container className="relative z-10 flex w-full flex-col justify-start pt-10 pb-16 md:pt-14 lg:pt-20">
        <div className="flex max-w-xl flex-col gap-3 md:max-w-2xl md:gap-4">
          <h1
            className={`m-0 font-bold leading-tight tracking-tight text-50 ${typography.pageTitle} lg:text-[56px]`}
          >
            {t('comingSoon.title')}
          </h1>
          <p className={`m-0 max-w-lg font-normal leading-relaxed text-50/90 ${typography.sectionDescription}`}>
            {t('comingSoon.description')}
          </p>
        </div>
      </Container>
    </main>
  )
}

export default ComingSoon
