import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'

const H2 = ({ children }) => (
  <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-7`}>{children}</h2>
)

const Body = ({ children }) => (
  <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{children}</p>
)

// A soft-tinted rounded card used for the individual cookie types and durations.
const TintCard = ({ title, body }) => (
  <div className="flex flex-col gap-3 rounded-[14px] border border-200 bg-gradient-to-b from-100 to-50 p-6">
    <h3 className={`m-0 font-medium text-700 ${typography.body} leading-6`}>{title}</h3>
    <Body>{body}</Body>
  </div>
)

const CookiesContent = () => {
  const { t } = useTranslation()

  const types = t('legal.cookies.types', { returnObjects: true }) || []
  const thirdParty = t('legal.cookies.thirdParty', { returnObjects: true }) || {}
  const usage = t('legal.cookies.usage', { returnObjects: true }) || {}
  const preferences = t('legal.cookies.preferences', { returnObjects: true }) || {}
  const duration = t('legal.cookies.duration', { returnObjects: true }) || {}
  const updates = t('legal.cookies.updates', { returnObjects: true }) || {}
  const whatAre = t('legal.cookies.whatAre', { returnObjects: true }) || {}
  const contact = t('legal.cookies.contact', { returnObjects: true }) || {}

  return (
    <div className="flex flex-col gap-10 rounded-[14px] border border-200 bg-50 px-5 py-10 shadow-sm md:px-8 md:py-14">
      <p className={`m-0 font-normal text-700 ${typography.caption}`}>{t('legal.lastUpdated')}</p>

      {/* What Are Cookies? */}
      <section className="flex flex-col gap-4">
        <H2>{whatAre.title}</H2>
        <Body>{whatAre.body}</Body>
      </section>

      {/* Types of Cookies */}
      <section className="flex flex-col gap-4">
        <H2>{t('legal.cookies.typesTitle')}</H2>
        <div className="flex flex-col gap-4">
          {types.map((type, index) => (
            <TintCard key={index} title={type.title} body={type.body} />
          ))}
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="flex flex-col gap-4">
        <H2>{thirdParty.title}</H2>
        <Body>{thirdParty.intro}</Body>
        <div className="grid gap-4 sm:grid-cols-2">
          {(thirdParty.items || []).map((item, index) => (
            <div key={index} className="rounded-[14px] bg-100 px-5 py-4">
              <p className={`m-0 font-normal text-700 ${typography.body}`}>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How We Use Cookies */}
      <section className="flex flex-col gap-4">
        <H2>{usage.title}</H2>
        <Body>{usage.intro}</Body>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {(usage.items || []).map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-secondary-900" />
              <span className={`font-normal text-700 ${typography.body}`}>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Managing Preferences */}
      <section className="flex flex-col gap-4">
        <H2>{preferences.title}</H2>
        <div className="rounded-[10px] border-s-4 border-secondary-900 bg-secondary-900/10 px-6 py-5">
          <Body>{preferences.intro}</Body>
        </div>
        <div className="flex flex-col gap-4">
          {(preferences.methods || []).map((method, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-[14px] bg-100 p-6">
              <h3 className={`m-0 font-medium text-700 ${typography.body} leading-6`}>{method.title}</h3>
              <Body>{method.body}</Body>
            </div>
          ))}
        </div>
        <div className="rounded-[14px] bg-main/5 px-5 py-5">
          <Body>{preferences.note}</Body>
        </div>
      </section>

      {/* How Long Do Cookies Last */}
      <section className="flex flex-col gap-4">
        <H2>{duration.title}</H2>
        <Body>{duration.intro}</Body>
        <div className="grid gap-6 sm:grid-cols-2">
          {(duration.items || []).map((item, index) => (
            <TintCard key={index} title={item.title} body={item.body} />
          ))}
        </div>
      </section>

      {/* Updates */}
      <section className="flex flex-col gap-4">
        <H2>{updates.title}</H2>
        <Body>{updates.body}</Body>
      </section>

      {/* Contact */}
      <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-main/5 to-secondary-900/5 p-8">
        <h2 className={`m-0 font-medium text-main ${typography.body} leading-6`}>{contact.title}</h2>
        <Body>{contact.intro}</Body>
        <div className={`flex flex-col gap-1 ${typography.body}`}>
          <p className="m-0 font-bold text-700">{contact.company}</p>
          <p className="m-0 font-normal text-700">
            {contact.emailLabel}{' '}
            <a href={`mailto:${contact.email}`} className="font-normal text-main no-underline hover:underline">
              {contact.email}
            </a>
          </p>
          <p className="m-0 font-normal text-700">
            {contact.phoneLabel}{' '}
            <a href={`tel:${(contact.phone || '').replace(/[^+\d]/g, '')}`} className="font-normal text-main no-underline hover:underline">
              {contact.phone}
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default CookiesContent
