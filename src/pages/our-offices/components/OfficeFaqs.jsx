import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import FaqItem from './FaqItem.jsx'

const faqIds = ['baggageAllowance', 'infantWeight', 'extraBag']

const OfficeFaqs = () => {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <h2 className={`${typography.sectionTitle} font-semibold text-700 m-0`}>
        {t('offices.faqs.title')}
      </h2>
      <div className="flex flex-col gap-3 md:gap-4">
        {faqIds.map((id) => (
          <FaqItem
            key={id}
            question={t(`offices.faqs.items.${id}.question`)}
            answer={t(`offices.faqs.items.${id}.answer`)}
          />
        ))}
      </div>
      <div className="flex justify-center pt-1 md:pt-2">
        <a
          href="#"
          className={`${typography.button} font-semibold text-50 bg-secondary hover:bg-secondary-800 no-underline rounded-lg px-8 py-3 md:px-10 md:py-3.5`}
        >
          {t('offices.faqs.browse')}
        </a>
      </div>
    </section>
  )
}

export default OfficeFaqs
