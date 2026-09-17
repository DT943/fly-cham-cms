import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import {
  ALIGN,
  SECTION_PADDING,
  CARD_GAP,
  GRID_COLS,
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../../styles/cmsStyle.js'
import {
  helpCategories as defaultCategories,
  resolveHelpCategoryIcon,
} from '../utils/helpCategories.jsx'
import HelpCategoryCard from './HelpCategoryCard.jsx'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'

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
  sectionTitleColorHover,
  sectionTitleFontWeightHover,
  sectionSubtitleColor = '600',
  sectionSubtitleColorHover,
  sectionSubtitleFontWeightHover,
  titleAlign = 'left',
  columns = 5,
  cardGap = 'default',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...cardStyle
}) => {
  const { t } = useTranslation()
  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

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

  const sectionTitleStyleKeys = {
    sectionTitleColor,
    sectionTitleFontWeight,
    sectionTitleColorHover,
    sectionTitleFontWeightHover,
  }
  const sectionSubtitleStyleKeys = {
    sectionSubtitleColor,
    sectionSubtitleColorHover,
    sectionSubtitleFontWeightHover,
  }

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
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(sectionTitleStyleKeys, 'sectionTitleColor', '700', 'bold')}
            >
              <LinkedText text={resolvedTitle} {...linkProps} />
            </h2>
          )}
          {showSectionSubtitle && resolvedSubtitle && (
            <p
              className={cx(typography.sectionDescription, 'm-0 max-w-3xl', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(sectionSubtitleStyleKeys, 'sectionSubtitleColor', '600', 'normal')}
            >
              <LinkedText text={resolvedSubtitle} {...linkProps} />
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
            linkProps={linkProps}
            {...cardStyle}
          />
        ))}
      </div>
    </SearchAnchor>
  )
}

export default HelpCategories
