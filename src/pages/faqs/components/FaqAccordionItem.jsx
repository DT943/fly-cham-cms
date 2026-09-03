import { CaretDown } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'

const FaqAccordionItem = ({ id, question, answer, image, imageAlt = '', open, onToggle }) => {
  const paragraphs = String(answer || '')
    .split('\n\n')
    .map((part) => part.trim())
    .filter(Boolean)
  const hasBody = paragraphs.length > 0 || Boolean(image)

  return (
    <div id={id} className="border-b border-200 last:border-b-0 scroll-mt-28">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className={`${typography.itemTitle} w-full bg-transparent border-0 flex items-center justify-between gap-6 cursor-pointer py-5 text-start transition-colors duration-300 ease-in-out motion-reduce:transition-none ${
            open ? 'font-medium text-primary-1' : 'font-medium text-800'
          }`}
        >
          <span className="min-w-0">{question}</span>
          <CaretDown
            size={16}
            weight="bold"
            className={`shrink-0 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
              open ? 'rotate-180 text-primary-1' : 'text-500'
            }`}
          />
        </button>
      </h3>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden min-h-0">
          {hasBody && (
            <div
              className={`flex flex-col md:flex-row md:items-start gap-5 md:gap-8 pb-6 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
                open ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {paragraphs.length > 0 && (
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  {paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className={`${typography.itemDescription} text-600 m-0 leading-relaxed whitespace-pre-line`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {image && (
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full md:w-[32%] md:max-w-70 rounded-xl object-cover shrink-0 aspect-5/4"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FaqAccordionItem
