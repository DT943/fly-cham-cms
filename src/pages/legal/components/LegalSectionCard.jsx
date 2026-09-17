import { typography } from '../../../styles/typography.js'

/**
 * A single legal clause rendered as a rounded card: a bold heading, body copy,
 * and an optional bullet list (e.g. the "Passenger Conduct" consequences).
 */
const LegalSectionCard = ({ title, body, items }) => (
  <div className="flex flex-col gap-3 rounded-[14px] bg-50 p-6">
    <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-6`}>{title}</h2>
    {body ? (
      <p className={`m-0 font-normal leading-6 text-700 ${typography.caption}`}>{body}</p>
    ) : null}
    {items?.length ? (
      <ul className={`m-0 flex list-disc flex-col gap-1 ps-5 text-700 ${typography.caption} leading-6`}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : null}
  </div>
)

export default LegalSectionCard
