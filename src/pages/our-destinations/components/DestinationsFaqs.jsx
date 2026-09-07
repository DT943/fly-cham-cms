import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Faqs from '../../../shared/components/Faqs.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'
import useCurrentLanguage from '../../../shared/hooks/useCurrentLanguage.js'
import { typography } from '../../../styles/typography.js'
import {
  destinationFaqCtas,
  destinationFaqIds,
  destinationNetwork,
  getManageBookingHref,
} from '../utils/destinationFaqs.js'

const FaqCta = ({ href, children }) => (
  <LocalizedLink
    href={href}
    className={`${typography.button} inline-flex w-fit items-center gap-2 font-semibold text-primary-1 no-underline`}
  >
    {children}
    <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" />
  </LocalizedLink>
)

const CityCodes = ({ codes, language }) => {
  if (codes.length === 1) {
    return <span dir="ltr">{codes[0]}</span>
  }

  if (language === 'ar') {
    return codes.map((code, index) => (
      <span key={code}>
        {index > 0 && ' و'}
        <span dir="ltr">{code}</span>
      </span>
    ))
  }

  return <span dir="ltr">{`${codes.join(' and ')} airports`}</span>
}

const DestinationNetworkList = () => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()

  return (
    <ul className={`${typography.itemDescription} m-0 flex list-none flex-col gap-3 p-0 text-600`}>
      {destinationNetwork.map((country) => (
        <li key={country.countryKey}>
          <strong className="font-semibold text-700">
            {t(`destinations.faqs.countries.${country.countryKey}`)}
          </strong>
          <ul className="mt-1.5 mb-0 flex list-none flex-col gap-1 ps-4">
            {country.cities.map((city) => (
              <li key={city.cityKey}>
                {t(`destinations.faqs.cities.${city.cityKey}`)}
                {' — '}
                <CityCodes codes={city.codes} language={language} />
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

const BaggageList = () => {
  const { t } = useTranslation()
  const items = ['light', 'smart', 'elite', 'business', 'cabin']

  return (
    <ul className={`${typography.itemDescription} m-0 flex list-disc flex-col gap-1 ps-5 text-600`}>
      {items.map((id) => (
        <li key={id}>{t(`destinations.faqs.items.baggage.list.${id}`)}</li>
      ))}
    </ul>
  )
}

const DestinationsFaqs = () => {
  const { t } = useTranslation()
  const language = useCurrentLanguage()

  const extras = {
    whereWeFly: (
      <>
        <DestinationNetworkList />
        <p className={`${typography.itemDescription} m-0 leading-relaxed text-600`}>
          {t('destinations.faqs.items.whereWeFly.note')}
        </p>
        <FaqCta href={destinationFaqCtas.whereWeFly}>
          {t('destinations.faqs.items.whereWeFly.cta')}
        </FaqCta>
      </>
    ),
    visa: (
      <FaqCta href={destinationFaqCtas.visa}>{t('destinations.faqs.items.visa.cta')}</FaqCta>
    ),
    airport: (
      <FaqCta href={destinationFaqCtas.airport}>{t('destinations.faqs.items.airport.cta')}</FaqCta>
    ),
    baggage: (
      <>
        <BaggageList />
        <p className={`${typography.itemDescription} m-0 leading-relaxed text-600`}>
          {t('destinations.faqs.items.baggage.note')}
        </p>
        <FaqCta href={destinationFaqCtas.baggage}>
          {t('destinations.faqs.items.baggage.cta')}
        </FaqCta>
      </>
    ),
    manageBooking: (
      <FaqCta href={getManageBookingHref(language)}>
        {t('destinations.faqs.items.manageBooking.cta')}
      </FaqCta>
    ),
  }

  const items = destinationFaqIds.map((id) => ({
    id,
    hit: `destinations-faq-${id}`,
    question: t(`destinations.faqs.items.${id}.question`),
    answer: t(`destinations.faqs.items.${id}.answer`),
    extra: extras[id],
  }))

  return (
    <SearchAnchor hit="destinations-faqs">
      <Faqs
        title={t('destinations.faqs.title')}
        items={items}
        browseLabel={t('destinations.faqs.browse')}
        browseHref="/help/faqs"
      />
    </SearchAnchor>
  )
}

export default DestinationsFaqs
