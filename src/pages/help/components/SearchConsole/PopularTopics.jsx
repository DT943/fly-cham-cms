import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../../../styles/cmsStyle.js'
import { typography } from '../../../../styles/typography.js'
import { cx } from './cx.js'

const PopularTopics = ({
  label,
  items,
  labelColor,
  labelColorHover,
  labelFontWeightHover,
  chipTextColor,
  chipTextColorHover,
  chipTextFontWeightHover,
  chipBorderColor,
  onSelect,
}) => {
  const popularLabelStyleKeys = {
    popularLabelColor: labelColor,
    popularLabelColorHover: labelColorHover,
    popularLabelFontWeightHover: labelFontWeightHover,
  }
  const chipTextStyleKeys = {
    chipTextColor,
    chipTextColorHover,
    chipTextFontWeightHover,
  }

  return (
    <div className="flex flex-col gap-2.5 pt-0.5 md:flex-row md:items-center md:gap-3">
      {label && (
        <span
          className={cx(typography.caption, 'whitespace-nowrap', CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(popularLabelStyleKeys, 'popularLabelColor', '50', 'medium')}
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
              CMS_TEXT_HOVER_CLASS,
            )}
            style={{
              border: `1px solid ${colorVar(chipBorderColor)}`,
              ...getTextStyleVars(chipTextStyleKeys, 'chipTextColor', '50', 'normal'),
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PopularTopics
