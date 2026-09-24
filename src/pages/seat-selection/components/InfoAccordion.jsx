import { useId, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

/**
 * Static seat-selection Terms / More Information accordion card.
 */
const InfoAccordion = ({ items }) => (
  <div className="overflow-hidden rounded-xl bg-50 px-5 shadow-[0px_2px_1px_rgba(33,37,41,0.06),0px_0px_0.5px_rgba(33,37,41,0.08)] sm:px-6">
    {items.map((item, index) => (
      <AccordionRow key={item.id} item={item} showDivider={index > 0} />
    ))}
  </div>
)

const AccordionRow = ({ item, showDivider }) => {
  const [open, setOpen] = useState(true)
  const buttonId = useId()
  const panelId = useId()

  return (
    <div className={showDivider ? 'border-t border-solid border-200' : ''}>
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className={`flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-0 py-5 text-start font-semibold text-700 ${typography.itemTitle}`}
        >
          <span className="min-w-0">{item.title}</span>
          <CaretDown
            size={18}
            weight="regular"
            className={`shrink-0 text-700 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`m-0 pb-5 font-normal leading-relaxed text-600 ${typography.itemDescription}`}
          >
            {item.body}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InfoAccordion
