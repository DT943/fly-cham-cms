import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../../shared/components/Breadcrumbs.jsx'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher.jsx'
import Container from '../../shared/components/Container.jsx'
import Faqs from '../../shared/components/Faqs.jsx'
import PageMediaHero from '../../shared/components/PageMediaHero.jsx'
import HelpCta from '../../shared/components/HelpCta.jsx'
import { typography } from '../../styles/typography.js'
import heroPhoto from '../../assets/images/about-us/hero.jpg'
import fleetPhoto from '../../assets/images/about-us/fleet.jpg'
import AboutStorySections from './components/AboutStorySections.jsx'
import AboutValues from './components/AboutValues.jsx'
import AboutMediaCards from './components/AboutMediaCards.jsx'

const AboutUs = () => {
  const { t } = useTranslation()

  const breadcrumbs = [
    { label: t('common.home'), href: '/' },
    { label: t('aboutUs.breadcrumb') },
  ]

  const faqQuestions = t('aboutUs.faq.items', { returnObjects: true }) || []
  const faqItems = faqQuestions.map((question, index) => ({
    id: `about-faq-${index}`,
    question,
    answer: t('aboutUs.faq.answerPlaceholder'),
  }))

  return (
    <main className="bg-100 w-full pb-12 md:pb-16">
      <Container className="pt-5 md:pt-10 pb-4 md:pb-6 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Breadcrumbs items={breadcrumbs} />
        <LanguageSwitcher />
      </Container>

      <PageMediaHero
        image={heroPhoto}
        imageAlt={t('aboutUs.hero.imageAlt')}
        title={t('aboutUs.hero.title')}
        subtitle={t('aboutUs.hero.subtitle')}
        objectPosition="center 50%"
      />

      <Container className="flex flex-col gap-14 pt-10 md:gap-16 md:pt-14">
        <p className={`m-0 font-normal leading-relaxed text-800 ${typography.body}`}>
          {t('aboutUs.intro')}
        </p>

        <AboutStorySections />

        <HelpCta
          contained={false}
          image={fleetPhoto}
          imageAlt={t('aboutUs.fleet.imageAlt')}
          title={t('aboutUs.fleet.title')}
          description={t('aboutUs.fleet.description')}
          cta={t('aboutUs.fleet.cta')}
          href="/our-destinations"
          objectPosition="center"
        />

        <AboutValues />

        <AboutMediaCards />

        <Faqs
          title={t('aboutUs.faq.title')}
          items={faqItems}
          browseLabel={t('aboutUs.faq.browse')}
          browseHref="/help/faqs"
        />
      </Container>
    </main>
  )
}

export default AboutUs
