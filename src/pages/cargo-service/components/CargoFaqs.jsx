import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CaretDown } from '@phosphor-icons/react'
import Container from '../../../shared/components/Container.jsx'
import LocalizedLink from '../../../shared/components/LocalizedLink.jsx'
import { typography } from '../../../styles/typography.js'

const AccordionItem = ({ title, body, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="w-full overflow-hidden rounded-xl border border-200 bg-50">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start sm:px-6 sm:py-5"
      >
        <span className={`font-medium text-secondary-2 ${typography.itemTitle}`}>{title}</span>
        <CaretDown
          size={22}
          className={`shrink-0 text-primary-1 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className={`m-0 px-5 pb-5 leading-relaxed text-600 sm:px-6 ${typography.itemDescription}`}>
            {body}
          </p>
        </div>
      </div>
    </div>
  )
}

const CargoFaqs = () => {
  const { t } = useTranslation()
  const faqItems = t('cargoService.faq.items', { returnObjects: true }) || []
  const details = t('cargoService.details.items', { returnObjects: true }) || []

  return (
    <section className="w-full min-w-0">
      <Container className="flex min-w-0 flex-col gap-10 py-10 md:gap-12 md:py-14">
        <div className="flex flex-col gap-7">
          <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
            {t('cargoService.faq.title')}
          </h2>
          <div className="flex flex-col items-center gap-8 md:gap-9">
            <div className="flex w-full flex-col gap-3 md:gap-4">
              {faqItems.map((question, index) => (
                <AccordionItem
                  key={question}
                  title={question}
                  body={t('cargoService.faq.answerPlaceholder')}
                  defaultOpen={index === 0}
                />
              ))}
            </div>
            <LocalizedLink
              href="/help/faqs"
              className={`flex h-14 min-w-[214px] items-center justify-center rounded-lg bg-primary-2 px-6 font-semibold text-btn no-underline transition-opacity hover:opacity-90 ${typography.button}`}
            >
              {t('cargoService.faq.browse')}
            </LocalizedLink>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 md:gap-4">
          {details.map((item) => (
            <AccordionItem key={item.title} title={item.title} body={item.body} defaultOpen />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default CargoFaqs
