import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'

const BeforeYouFlyServices = ({ i18nKey, services }) => {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col">
      {services.map(({ id, image, href }) => (
        <article
          key={id}
          className="flex flex-col gap-4 border-b border-200 py-6 sm:flex-row sm:items-center sm:gap-12"
        >
          <img
            src={image}
            alt={t(`${i18nKey}.services.${id}.imageAlt`)}
            className="h-48 w-full shrink-0 rounded-2xl object-cover sm:h-43 sm:w-82"
          />
          <div className="flex flex-1 flex-col items-start gap-4">
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 text-xl font-semibold text-700">
                {t(`${i18nKey}.services.${id}.title`)}
              </h3>
              <p className="m-0 text-sm font-normal leading-relaxed text-900">
                {t(`${i18nKey}.services.${id}.description`)}
              </p>
            </div>
            <LocalizedLink
              href={href}
              className="group/lm relative inline-flex h-[34px] w-fit items-center overflow-hidden rounded-full text-sm font-semibold no-underline"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 start-0 w-[34px] rounded-full bg-primary-1 transition-[width] duration-300 ease-out group-hover/lm:w-full"
              />
              <span className="relative z-10 flex size-[34px] shrink-0 items-center justify-center">
                <ArrowRight size={16} weight="bold" className="text-50 rtl:-scale-x-100" />
              </span>
              <span className="relative z-10 pe-3 ps-2.5 text-primary-1 transition-colors duration-300 group-hover/lm:text-50">
                {t(`${i18nKey}.learnMore`)}
              </span>
            </LocalizedLink>
          </div>
        </article>
      ))}
    </Container>
  )
}

export default BeforeYouFlyServices
