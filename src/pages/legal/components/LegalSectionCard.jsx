import { typography } from '../../../styles/typography.js'

/**
 * A single legal clause rendered as a rounded card: a bold heading, optional
 * body copy, nested sub-blocks (subheading / paragraph / bullets), and/or a
 * top-level bullet list (e.g. Passenger Conduct consequences).
 */
const LegalSectionCard = ({ title, body, items, blocks }) => (
  <div className="flex flex-col gap-3 rounded-[14px] bg-50 p-6">
    <h2 className={`m-0 font-semibold text-700 ${typography.itemTitle} leading-6`}>{title}</h2>

    {body ? (
      <p className={`m-0 font-normal leading-6 text-700 ${typography.caption}`}>{body}</p>
    ) : null}

    {(blocks || []).map((block, index) => {
      if (block.type === 'subheading') {
        return (
          <h3 key={index} className={`m-0 mt-1 font-semibold text-700 ${typography.body} leading-6`}>
            {block.text}
          </h3>
        )
      }

      if (block.type === 'bullets') {
        return (
          <ul
            key={index}
            className={`m-0 flex list-disc flex-col gap-1 ps-5 text-700 ${typography.caption} leading-6`}
          >
            {(block.items || []).map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        )
      }

      return (
        <p key={index} className={`m-0 font-normal leading-6 text-700 ${typography.caption}`}>
          {block.text}
        </p>
      )
    })}

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
