import { colorVar } from '../../../../styles/cmsStyle.js'
import { typography } from '../../../../styles/typography.js'
import { cx } from './cx.js'

const PopularTopics = ({
  label,
  items,
  labelColor,
  chipTextColor,
  chipBorderColor,
  onSelect,
}) => (
  <div className="flex flex-col gap-2.5 pt-0.5 md:flex-row md:items-center md:gap-3">
    {label && (
      <span
        className={cx(typography.caption, 'font-medium whitespace-nowrap')}
        style={{ color: colorVar(labelColor) }}
      >
        {label}
      </span>
    )}
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <button
          key={item.id || `${item.label}-${index}`}
          type="button"
          onClick={() => onSelect(item.query || item.label)}
          className={cx(
            typography.caption,
            'cursor-pointer whitespace-nowrap rounded-full bg-transparent px-4 py-1.5',
            'transition-colors hover:bg-50/15',
          )}
          style={{
            color: colorVar(chipTextColor),
            border: `1px solid ${colorVar(chipBorderColor)}`,
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  </div>
)

export default PopularTopics
