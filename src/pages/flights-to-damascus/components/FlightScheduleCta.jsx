import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import ctaPhoto from '../../../assets/images/flights-to-damascus/cta-plane.png'

const FlightScheduleCta = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <div className="relative isolate overflow-hidden rounded-xl bg-primary-1">
        <img src={ctaPhoto} alt="" className="absolute inset-0 size-full object-cover opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-secondary-2 to-transparent to-90% rtl:bg-linear-to-l" />

        <div className="relative flex flex-col items-start gap-6 px-6 py-10 sm:px-10 md:py-14 lg:px-14">
          <div className="flex max-w-160 flex-col gap-3 text-50">
            <h2 className="m-0 text-2xl font-semibold sm:text-3xl lg:text-[36px]">
              {t('flightsToDamascus.cta.title')}
            </h2>
            <p className="m-0 text-base leading-6 sm:text-lg">
              {t('flightsToDamascus.cta.description')}
            </p>
          </div>
          <LocalizedLink
            href="/our-destinations/route-map"
            className="inline-flex items-center justify-center rounded-lg bg-secondary-900 px-6 py-3.5 text-base font-semibold text-white no-underline transition-opacity hover:opacity-90 sm:text-lg"
          >
            {t('flightsToDamascus.cta.button')}
          </LocalizedLink>
        </div>
      </div>
    </Container>
  )
}

export default FlightScheduleCta
