import { useTranslation } from 'react-i18next'
import { ArrowRight } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { beforeYouFlyServices } from '../utils/beforeYouFlyContent.js'

const BeforeYouFlyServices = () => {
  const { t } = useTranslation()

  return (
    <Container className="flex flex-col">
      {beforeYouFlyServices.map(({ id, image, href }) => (
        <article
          key={id}
          className="flex flex-col gap-4 border-b border-200 py-6 sm:flex-row sm:items-center sm:gap-12"
        >
          <img
            src={image}
            alt={t(`beforeYouFly.services.${id}.imageAlt`)}
            className="h-48 w-full shrink-0 rounded-2xl object-cover sm:h-43 sm:w-82"
          />
          <div className="flex flex-1 flex-col items-start gap-4">
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 text-xl font-semibold text-700">
                {t(`beforeYouFly.services.${id}.title`)}
              </h3>
              <p className="m-0 text-sm font-normal leading-relaxed text-900">
                {t(`beforeYouFly.services.${id}.description`)}
              </p>
            </div>
            <LocalizedLink
              href={href}
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-primary-1 no-underline"
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-primary-1">
                <ArrowRight size={16} weight="bold" className="text-50 rtl:-scale-x-100" />
              </span>
              {t('beforeYouFly.learnMore')}
            </LocalizedLink>
          </div>
        </article>
      ))}
    </Container>
  )
}

export default BeforeYouFlyServices
