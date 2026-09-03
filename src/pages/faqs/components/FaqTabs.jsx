import { typography } from '../../../styles/typography.js'

const FaqTabs = ({ tabs = [], activeId, onSelect, label }) => {
  if (!tabs.length) return null

  return (
    <div role="tablist" aria-label={label} className="flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={`${typography.caption} m-0 shrink-0 cursor-pointer font-medium rounded-lg px-3 py-2.5 sm:px-4 border-none text-start transition-colors duration-200 ease-in-out motion-reduce:transition-none ${
              isActive ? 'bg-primary-1 text-white' : 'bg-200 text-700'
            }`}
          >
            {tab.title}
          </button>
        )
      })}
    </div>
  )
}

export default FaqTabs
