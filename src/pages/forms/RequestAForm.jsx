import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import Container from '../../shared/components/Container.jsx'
import CtaBanner from '../../shared/components/CtaBanner.jsx'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import { withLanguage } from '../../i18n/languages.js'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { getSupportForm } from './utils/supportForms.js'
import { typography } from '../../styles/typography.js'
import FormAccessForm from './components/FormAccessForm.jsx'

function getRequestFormId(pagePath) {
  const match = pagePath.match(/^\/help\/contact-us\/forms\/([^/]+)\/request$/)
  return match?.[1] || ''
}

const RequestAForm = () => {
  const { t } = useTranslation()
  const { pagePath } = useLocalizedRoute()
  const language = useCurrentLanguage()
  const formId = getRequestFormId(pagePath)
  const form = getSupportForm(formId)

  if (!form) {
    return <Navigate to={withLanguage('/help/contact-us/forms', language)} replace />
  }

  const formTitle = t(`forms.items.${form.id}.title`)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.contactUs'), href: '/help/contact-us' },
    { label: t('common.forms'), href: '/help/contact-us/forms' },
    { label: t('forms.request.title') },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <PageHero
          title={t('forms.request.title')}
          subtitle={t('forms.request.subtitle')}
        />
        <CtaBanner
          title={t('help.urgent.title')}
          description={t('help.urgent.description')}
          cta={t('help.urgent.cta')}
        />
        <section className="bg-background rounded-2xl border border-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-5 py-6 sm:px-8 md:px-10 md:py-8 flex flex-col gap-5 md:gap-6">
          <div className="flex flex-col gap-2">
            <p className={`${typography.caption} font-medium text-primary-1 m-0`}>
              {t(`forms.filters.${form.stageId}`)}
            </p>
            <h2 className={`${typography.sectionTitle} font-bold text-800 m-0`}>
              {formTitle}
            </h2>
            <p className={`${typography.itemDescription} text-600 m-0`}>
              {t('forms.access.subtitle')}
            </p>
          </div>
          <FormAccessForm formId={form.id} />
        </section>
      </Container>
    </main>
  )
}

export default RequestAForm
