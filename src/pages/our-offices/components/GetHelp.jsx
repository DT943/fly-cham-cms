import { useTranslation } from 'react-i18next'
import { typography } from '../../../styles/typography.js'
import { colorVar, CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../../styles/cmsStyle.js'
import GetHelpCard from './GetHelpCard.jsx'
import { resolveGetHelpIcon } from '../utils/getHelpIcons.jsx'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

// Mirror cms2's GetHelp token maps so the CMS preview and public render match.
// `default` adds no wrapper padding: the static OurOffices call site and the
// /new-help Container both own their own spacing (matches ContactChannels).
const SECTION_PADDING_CLASS = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}
const CARD_GAP_CLASS = {
  tight: 'gap-3 md:gap-4',
  default: 'gap-4 md:gap-5',
  loose: 'gap-5 md:gap-8',
}
const COLUMNS_CLASS = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
}
const TITLE_ALIGN_CLASS = {
  left: 'text-start items-start',
  center: 'text-center items-center',
  right: 'text-end items-end',
}

const defaultItems = [
  { id: 'customerCare', icon: 'headset', href: '/help/contact-us' },
  { id: 'forms', icon: 'clipboard', href: '/help/contact-us/forms' },
]

/**
 * Get Help — header + grid of support cards (each card a whole link with an
 * arrow badge). Dual-use: renders the original OurOffices design from i18n when
 * called with no props, or a CMS-authored block when the /new-help adapter
 * supplies content + style. Backlinks apply to the header only (cards are
 * anchors).
 */
const GetHelp = ({
  title,
  subtitle,
  items,
  showHeader = true,
  showTitle = true,
  showSubtitle = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  columns = '2',
  cardGap = 'default',
  titleAlign = 'left',
  titleColor = '700',
  titleFontWeight = 'semibold',
  titleColorHover,
  titleFontWeightHover,
  subtitleColor = '700',
  subtitleFontWeight = 'normal',
  subtitleColorHover,
  subtitleFontWeightHover,
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

  const resolvedTitle = title ?? t('offices.getHelp.title')
  const resolvedSubtitle = subtitle ?? t('offices.getHelp.subtitle')
  const resolvedItems =
    items ??
    defaultItems.map((item) => ({
      id: item.id,
      icon: resolveGetHelpIcon(item.icon),
      href: item.href,
      title: t(`offices.getHelp.items.${item.id}.title`),
      description: t(`offices.getHelp.items.${item.id}.description`),
    }))

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const titleStyleKeys = { titleColor, titleFontWeight, titleColorHover, titleFontWeightHover }
  const subtitleStyleKeys = {
    subtitleColor,
    subtitleFontWeight,
    subtitleColorHover,
    subtitleFontWeightHover,
  }

  const showTitleRow = showHeader && showTitle && resolvedTitle
  const showSubtitleRow = showHeader && showSubtitle && resolvedSubtitle
  const headerVisible = showTitleRow || showSubtitleRow

  const paddingClass = SECTION_PADDING_CLASS[sectionPadding] ?? SECTION_PADDING_CLASS.default
  const gapClass = CARD_GAP_CLASS[cardGap] ?? CARD_GAP_CLASS.default
  const columnsClass = COLUMNS_CLASS[String(columns)] ?? COLUMNS_CLASS[2]
  const alignClass = TITLE_ALIGN_CLASS[titleAlign] ?? TITLE_ALIGN_CLASS.left

  return (
    <section
      className={cx(
        'flex flex-col gap-4 md:gap-6',
        paddingClass,
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {headerVisible && (
        <div className={cx('flex flex-col gap-1', alignClass)}>
          {showTitleRow && (
            <h2
              className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'semibold')}
            >
              <LinkedText text={resolvedTitle} {...linkProps} />
            </h2>
          )}
          {showSubtitleRow && (
            <p
              className={cx(typography.sectionDescription, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(subtitleStyleKeys, 'subtitleColor', '700', 'normal')}
            >
              <LinkedText text={resolvedSubtitle} {...linkProps} />
            </p>
          )}
        </div>
      )}
      <div className={cx('grid grid-cols-1', columnsClass, gapClass)}>
        {resolvedItems.map((item) => (
          <GetHelpCard
            key={item.id || item.title}
            icon={typeof item.icon === 'string' ? resolveGetHelpIcon(item.icon) : item.icon}
            href={item.href}
            title={item.title}
            description={item.description}
            {...cardStyle}
          />
        ))}
      </div>
    </section>
  )
}

export default GetHelp
