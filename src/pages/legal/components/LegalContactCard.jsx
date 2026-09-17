import { typography } from '../../../styles/typography.js'

const linkClass = 'font-medium text-primary-1 no-underline hover:underline'

/**
 * Closing "Contact Information" card for the Terms and Privacy documents, with
 * the e-mail and phone rendered as actionable links.
 */
const LegalContactCard = ({ title, intro, emailLabel, email, phoneLabel, phone }) => (
  <div className="flex flex-col gap-3 rounded-[14px] bg-50 p-6">
    <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-6`}>{title}</h2>
    <p className={`m-0 font-normal leading-6 text-700 ${typography.caption}`}>
      {intro}
      <br />
      {emailLabel}{' '}
      <a href={`mailto:${email}`} className={linkClass}>
        {email}
      </a>
      <br />
      {phoneLabel}{' '}
      <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className={linkClass}>
        {phone}
      </a>
    </p>
  </div>
)

export default LegalContactCard
