import { useId, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false)
  const buttonId = useId()
  const panelId = useId()

  return (
    <div className="bg-background rounded-xl border border-200">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((isOpen) => !isOpen)}
          className={`${typography.itemTitle} font-medium text-700 w-full bg-transparent border-0 flex items-center justify-between gap-4 cursor-pointer px-4 py-4 md:px-6 md:py-5 text-start`}
        >
          <span className="min-w-0">{question}</span>
          <CaretDown
            size={18}
            weight="regular"
            className={`shrink-0 text-700 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden min-h-0">
          {answer && (
            <p className={`${typography.itemDescription} text-600 m-0 px-4 pb-4 md:px-6 md:pb-5 leading-relaxed`}>
              {answer}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default FaqItem
