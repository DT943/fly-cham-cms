import { typography } from '../../../styles/typography.js'
import { colorMix } from '../../../styles/cmsStyle.js'

const linkClass = 'font-medium text-primary-1 no-underline hover:underline'
const companyLinkClass = 'font-normal text-main no-underline hover:underline'

const telHref = (phone) => `tel:${String(phone || '').replace(/[^+\d]/g, '')}`

/**
 * Closing contact block. `links` matches Terms (email/phone inline).
 * `company` matches the Cookies gradient card.
 */
const LegalDocumentContact = ({
  variant = 'links',
  title = '',
  intro = '',
  emailLabel = '',
  email = '',
  phoneLabel = '',
  phone = '',
  company = '',
  department = '',
}) => {
  if (!title && !intro && !email && !phone) return null

  if (variant === 'company') {
    return (
      <section
        className="flex flex-col gap-4 rounded-2xl p-8"
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${colorMix('main', 5)}, ${colorMix('secondary-900', 5)})`,
        }}
      >
        {title ? (
          <h2 className={`m-0 font-medium text-main ${typography.body} leading-6`}>{title}</h2>
        ) : null}
        {intro ? (
          <p className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>{intro}</p>
        ) : null}
        <div className={`flex flex-col gap-1 ${typography.body}`}>
          {company ? <p className="m-0 font-bold text-700">{company}</p> : null}
          {department ? <p className="m-0 font-normal text-700">{department}</p> : null}
          {email ? (
            <p className="m-0 font-normal text-700">
              {emailLabel ? `${emailLabel} ` : null}
              <a href={`mailto:${email}`} className={companyLinkClass}>
                {email}
              </a>
            </p>
          ) : null}
          {phone ? (
            <p className="m-0 font-normal text-700">
              {phoneLabel ? `${phoneLabel} ` : null}
              <a href={telHref(phone)} className={companyLinkClass}>
                {phone}
              </a>
            </p>
          ) : null}
        </div>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-[14px] bg-50 p-6">
      {title ? (
        <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-6`}>
          {title}
        </h2>
      ) : null}
      <p className={`m-0 font-normal leading-6 text-700 ${typography.caption}`}>
        {intro}
        {email ? (
          <>
            <br />
            {emailLabel ? `${emailLabel} ` : null}
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
          </>
        ) : null}
        {phone ? (
          <>
            <br />
            {phoneLabel ? `${phoneLabel} ` : null}
            <a href={telHref(phone)} className={linkClass}>
              {phone}
            </a>
          </>
        ) : null}
      </p>
    </div>
  )
}

export default LegalDocumentContact
