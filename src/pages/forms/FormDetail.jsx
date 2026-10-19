import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import PageHero from '../../shared/components/PageHero.jsx'
import Container from '../../shared/components/Container.jsx'
import useLocalizedRoute from '../../shared/routing/hooks/useLocalizedRoute.js'
import { withLanguage } from '../../i18n/languages.js'
import useCurrentLanguage from '../../shared/hooks/useCurrentLanguage.js'
import { getSupportForm } from './utils/supportForms.js'

const FormDetail = () => {
  const { t } = useTranslation()
  const { pagePath } = useLocalizedRoute()
  const language = useCurrentLanguage()
  const formId = pagePath.split('/').pop()
  const form = getSupportForm(formId)

  if (!form) {
    return <Navigate to={withLanguage('/help/contact-us/forms', language)} replace />
  }

  const title = t(`forms.items.${form.id}.title`)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.contactUs'), href: '/help/contact-us' },
    { label: t('common.forms'), href: '/help/contact-us/forms' },
    { label: title },
  ]

  return (
    <main className="bg-100 w-full">
      <Breadcrumbs items={breadcrumbs} />
      <Container className="flex flex-col gap-6 py-5 md:gap-10 md:py-10">
        <PageHero title={title} />
      </Container>
    </main>
  )
}

export default FormDetail
