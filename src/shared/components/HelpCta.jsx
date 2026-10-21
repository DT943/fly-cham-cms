import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from './Container.jsx'
import Button from './Button.jsx'
import useCurrentLanguage from '../hooks/useCurrentLanguage.js'

/**
 * Rounded image banner with a left navy scrim and a title / description / CTA.
 * Overlay matches Figma exactly:
 *   opacity 0.9, linear-gradient(#01263B → transparent), borderRadius 12, blur 23.10px
 *
 * `objectPosition` is a raw CSS value so each caller can tune the photo's focal
 * point; `contained` wraps the card in a `Container` for full-width pages.
 */
const HelpCta = ({
  contained = true,
  image,
  imageAlt,
  title,
  description,
  cta,
  href = '/help',
  objectPosition = '70% center',
  // Optional CMS button styling (getButtonStyle output); absent = static look.
  buttonClassName = '',
  buttonStyle,
}) => {
  const { t } = useTranslation()
  const isRtl = useCurrentLanguage() === 'ar'
  const deg = isRtl ? 270 : 90

  const card = (
    <section className="relative isolate overflow-hidden rounded-xl bg-secondary-2">
      {image ? (
        <img loading="lazy" decoding="async"
          src={image}
          alt={imageAlt ?? t('common.helpCta.imageAlt')}
          style={{ objectPosition }}
          className="absolute inset-0 size-full object-cover"
        />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.9,
          background: `linear-gradient(${deg}deg, #01263B 0%, rgba(1, 38, 59, 0) 100%)`,
          borderRadius: 12,
          backdropFilter: 'blur(23.10px)',
          WebkitBackdropFilter: 'blur(23.10px)',
        }}
        aria-hidden
      />

      <div className="relative flex flex-col gap-6 px-6 py-10 sm:px-10 md:px-14 md:py-16 lg:min-h-90">
        <div className="flex flex-col gap-3 text-50">
          <h2 className="m-0 text-2xl font-semibold leading-tight sm:text-3xl lg:text-[36px]">
            {title ?? t('common.helpCta.title')}
          </h2>
          <p className="m-0 text-base leading-relaxed lg:text-lg">
            {description ?? t('common.helpCta.description')}
          </p>
        </div>
        <Button
          href={href}
          className={`inline-flex w-fit items-center gap-2.5 ${buttonClassName}`.trim()}
          style={buttonStyle}
        >
          {cta ?? t('common.helpCta.cta')}
          <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
        </Button>
      </div>
    </section>
  )

  return contained ? <Container>{card}</Container> : card
}

export default HelpCta
