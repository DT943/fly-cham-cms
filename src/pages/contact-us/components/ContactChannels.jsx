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
  contactChannels as defaultChannels,
  resolveContactChannelIcon,
} from '../utils/contactChannels.jsx'
import ContactChannelCard from './ContactChannelCard.jsx'
import SearchAnchor from '../../../shared/search/components/SearchAnchor.jsx'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const ContactChannels = ({
  title,
  channels,
  showHeader = true,
  showTitle = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'default',
  titleColor = '700',
  titleFontWeight = 'bold',
  titleColorHover,
  titleFontWeightHover,
  titleAlign = 'left',
  columns,
  cardGap,
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
  const titleStyleKeys = {
    titleColor,
    titleFontWeight,
    titleColorHover,
    titleFontWeightHover,
  }

  const resolvedTitle = title ?? t('contact.channels.title')
  const resolvedChannels =
    channels ??
    defaultChannels.map((channel) => ({
      id: channel.id,
      icon: resolveContactChannelIcon(channel.icon),
      href: channel.href,
      title: t(`contact.channels.items.${channel.id}.title`),
      description: t(`contact.channels.items.${channel.id}.description`),
      cta: t(`contact.channels.items.${channel.id}.cta`),
    }))

  const headerVisible = showHeader && showTitle && resolvedTitle
  const gridColsClass = columns
    ? GRID_COLS[String(columns)] || GRID_COLS[3]
    : 'grid-cols-1 md:grid-cols-3'
  const gapClass = cardGap ? CARD_GAP[cardGap] || CARD_GAP.default : 'gap-4 md:gap-5'

  return (
    <SearchAnchor
      hit="contact-channels"
      as="section"
      className={cx(
        'flex flex-col gap-4 md:gap-6',
        SECTION_PADDING[sectionPadding],
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {headerVisible && (
        <div className={cx('flex flex-col gap-2', ALIGN[titleAlign])}>
          <h2
            className={cx(typography.sectionTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
            style={getTextStyleVars(titleStyleKeys, 'titleColor', '700', 'bold')}
          >
            <LinkedText text={resolvedTitle} {...linkProps} />
          </h2>
        </div>
      )}
      <div className={cx('grid', gridColsClass, gapClass)}>
        {resolvedChannels.map((channel) => (
          <ContactChannelCard
            key={channel.id || channel.title}
            icon={channel.icon}
            href={channel.href}
            title={channel.title}
            description={channel.description}
            cta={channel.cta}
            links={links}
            showLinks={showLinks}
            linkColor={linkColor}
            linkHoverColor={linkHoverColor}
            linkFontWeight={linkFontWeight}
            linkUnderline={linkUnderline}
            linkItalic={linkItalic}
            {...cardStyle}
          />
        ))}
      </div>
    </SearchAnchor>
  )
}

export default ContactChannels
