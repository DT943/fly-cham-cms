import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from './Container.jsx'
import Button from './Button.jsx'
import helpPhoto from '../../assets/images/travel-experience/help-cta.png'

/**
 * Contained rounded help card closing a page. The photo already carries the
 * baked navy wash (dark on the copy side, muted agent on the far side); a light
 * navy scrim keeps the text legible where the crop shifts on smaller screens.
 */
const HelpCta = ({ contained = true }) => {
  const { t } = useTranslation()

  const card = (
      <section className="relative isolate overflow-hidden rounded-2xl bg-secondary-2">
        <img
          src={helpPhoto}
          alt={t('common.helpCta.imageAlt')}
          className="absolute inset-0 size-full object-cover object-[70%_center]"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-secondary-2/80 from-10% to-transparent to-70% rtl:bg-linear-to-l" />

        <div className="relative flex flex-col gap-6 px-6 py-10 sm:px-10 md:px-14 md:py-16 lg:min-h-90">
          <div className="flex max-w-160 flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-semibold leading-tight sm:text-3xl lg:text-[36px]">
              {t('common.helpCta.title')}
            </h2>
            <p className="m-0 text-base leading-relaxed lg:text-lg">
              {t('common.helpCta.description')}
            </p>
          </div>
          <Button href="/help" className="inline-flex w-fit items-center gap-2.5">
            {t('common.helpCta.cta')}
            <ArrowRight size={24} weight="bold" className="rtl:-scale-x-100" />
          </Button>
        </div>
      </section>
  )

  return contained ? <Container>{card}</Container> : card
}

export default HelpCta
