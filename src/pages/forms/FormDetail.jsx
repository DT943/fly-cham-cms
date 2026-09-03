import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
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
    return <Navigate to={withLanguage('/help/forms', language)} replace />
  }

  const title = t(`forms.items.${form.id}.title`)

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('common.help'), href: '/help' },
    { label: t('common.forms'), href: '/help/forms' },
    { label: title },
  ]

  return (
    <main className="bg-100 w-full">
      <Container className="py-5 md:py-10 flex flex-col gap-6 md:gap-10">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Breadcrumbs items={breadcrumbs} />
          <LanguageSwitcher />
        </div>
        <PageHero title={title} />
      </Container>
    </main>
  )
}

export default FormDetail
