import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import {
  ALIGN,
  WEIGHT,
  SECTION_PADDING,
  CARD_GAP,
  GRID_COLS,
  colorVar,
} from '../../../styles/cmsStyle.js'
import {
  helpCategories as defaultCategories,
  resolveHelpCategoryIcon,
} from '../utils/helpCategories.jsx'
import HelpCategoryCard from './HelpCategoryCard.jsx'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const HelpCategories = ({
  title,
  subtitle,
  cards,
  showHeader = true,
  showSectionTitle = true,
  showSectionSubtitle = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  sectionTitleColor = '700',
  sectionTitleFontWeight = 'bold',
  sectionSubtitleColor = '600',
  titleAlign = 'left',
  columns = 5,
  cardGap = 'default',
  ...cardStyle
}) => {
  const { t } = useTranslation()

  const resolvedTitle = title ?? t('help.categories.title')
  const resolvedSubtitle = subtitle ?? t('help.categories.subtitle')
  const resolvedCards = cards ?? defaultCategories.map((cat) => ({
    id: cat.id,
    href: cat.href,
    icon: resolveHelpCategoryIcon(cat.icon),
    title: t(`help.categories.items.${cat.id}.title`),
    description: t(`help.categories.items.${cat.id}.description`),
  }))

  const colKey = String(columns)
  const headerVisible = showHeader && (showSectionTitle || showSectionSubtitle)

  return (
    <SearchAnchor
      hit="help-categories"
      as="section"
      className={cx(
        'flex flex-col gap-4',
        SECTION_PADDING[sectionPadding],
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {headerVisible && (
        <div className={cx('flex flex-col gap-2', ALIGN[titleAlign])}>
          {showSectionTitle && resolvedTitle && (
            <h2
              className={cx(
                typography.sectionTitle,
                WEIGHT[sectionTitleFontWeight] || 'font-bold',
                'm-0',
              )}
              style={{ color: colorVar(sectionTitleColor) }}
            >
              {resolvedTitle}
            </h2>
          )}
          {showSectionSubtitle && resolvedSubtitle && (
            <p
              className={cx(typography.sectionDescription, 'm-0 max-w-3xl')}
              style={{ color: colorVar(sectionSubtitleColor) }}
            >
              {resolvedSubtitle}
            </p>
          )}
        </div>
      )}
      <div
        className={cx(
          'grid',
          GRID_COLS[colKey] || GRID_COLS[5],
          CARD_GAP[cardGap] || CARD_GAP.default,
        )}
      >
        {resolvedCards.map((card) => (
          <HelpCategoryCard
            key={card.id || card.title}
            icon={card.icon}
            href={card.href}
            title={card.title}
            description={card.description}
            {...cardStyle}
          />
        ))}
      </div>
    </SearchAnchor>
  )
}

export default HelpCategories
