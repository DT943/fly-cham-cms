import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from './Container.jsx'
import Button from './Button.jsx'
import helpPhoto from '../../assets/images/travel-experience/help-cta.png'

/**
 * Rounded image banner with a left navy scrim and a title / description / CTA.
 * Defaults to the "need help?" content, but every field can be overridden from
 * the parent to reuse the same banner elsewhere (e.g. the About page fleet CTA).
 *
 * `objectPosition` is a raw CSS value so each caller can tune the photo's focal
 * point; `contained` wraps the card in a `Container` for full-width pages.
 */
const HelpCta = ({
  contained = true,
  image = helpPhoto,
  imageAlt,
  title,
  description,
  cta,
  href = '/help',
  objectPosition = '70% center',
}) => {
  const { t } = useTranslation()

  const card = (
    <section className="relative isolate overflow-hidden rounded-2xl bg-secondary-2">
      <img
        src={image}
        alt={imageAlt ?? t('common.helpCta.imageAlt')}
        style={{ objectPosition }}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-secondary-2/80 from-10% to-transparent to-70% rtl:bg-linear-to-l" />

      <div className="relative flex flex-col gap-6 px-6 py-10 sm:px-10 md:px-14 md:py-16 lg:min-h-90">
        <div className="flex max-w-160 flex-col gap-3 text-50">
          <h2 className="m-0 text-2xl font-semibold leading-tight sm:text-3xl lg:text-[36px]">
            {title ?? t('common.helpCta.title')}
          </h2>
          <p className="m-0 text-base leading-relaxed lg:text-lg">
            {description ?? t('common.helpCta.description')}
          </p>
        </div>
        <Button href={href} className="inline-flex w-fit items-center gap-2.5">
          {cta ?? t('common.helpCta.cta')}
          <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
        </Button>
      </div>
    </section>
  )

  return contained ? <Container>{card}</Container> : card
}

export default HelpCta
