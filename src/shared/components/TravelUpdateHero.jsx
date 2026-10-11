import {
  colorVar,
  getTextStyleVars,
  CMS_TEXT_HOVER_CLASS,
} from '../../styles/cmsStyle.js'
import LinkedText from './backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

// Pinned px from the Figma frame (40139:21964) — identical to cms2.
const TAG_SIZE_CLASS = 'text-[11px] md:text-[12px] leading-[normal]'
const TITLE_SIZE_CLASS = 'text-[28px] md:text-[40px] lg:text-[48px] leading-[normal]'
const SUBTITLE_SIZE_CLASS = 'text-base md:text-[18px] leading-[normal]'

const SECTION_PADDING_CLASS = {
  none: '',
  tight: 'py-4 md:py-6',
  default: '',
  loose: 'py-10 md:py-16',
}

const linkStyle = (style) => ({
  linkColor: style.linkColor,
  linkHoverColor: style.linkHoverColor,
  linkFontWeight: style.linkFontWeight,
  linkUnderline: style.linkUnderline,
  linkItalic: style.linkItalic,
})

/**
 * CMS-driven travel update detail hero — type + date tag, big title, subtitle
 * (Figma "Hero Text Box"). Mirrors flychamadmin cms2's TravelUpdateHero.
 */
const TravelUpdateHero = ({
  tag,
  title,
  subtitle,
  links = [],
  showLinks = true,
  showTag = true,
  showSubtitle = true,
  showSectionBg = false,
  sectionBg = '100',
  sectionPadding = 'none',
  tagBg = 'secondary',
  ...rest
}) => {
  const style = { showLinks, ...rest }
  const linkProps = { links, enabled: showLinks, ...linkStyle(style) }

  return (
    <section
      className={cx(
        'flex flex-col items-start gap-4',
        SECTION_PADDING_CLASS[sectionPadding] ?? '',
        showSectionBg && 'rounded-2xl px-4 md:px-6',
      )}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      {showTag && tag && (
        <span
          className={cx('rounded-[4px] px-3 py-1.5 uppercase', TAG_SIZE_CLASS, CMS_TEXT_HOVER_CLASS)}
          style={{
            backgroundColor: colorVar(tagBg),
            ...getTextStyleVars(style, 'badgeText', 'primary-1', 'semibold'),
          }}
        >
          {tag}
        </span>
      )}
      {title && (
        <h1
          className={cx('m-0', TITLE_SIZE_CLASS, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(style, 'titleColor', 'primary-1', 'bold')}
        >
          <LinkedText text={title} {...linkProps} />
        </h1>
      )}
      {showSubtitle && subtitle && (
        <p
          className={cx('m-0', SUBTITLE_SIZE_CLASS, CMS_TEXT_HOVER_CLASS)}
          style={getTextStyleVars(style, 'subtitleColor', '700', 'medium')}
        >
          <LinkedText text={subtitle} {...linkProps} />
        </p>
      )}
    </section>
  )
}

export default TravelUpdateHero
