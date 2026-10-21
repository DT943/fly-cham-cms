import { Clock } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
  colorVar,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'

const IMAGE_RADIUS = {
  none: 'rounded-none',
  lg: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

/**
 * News article hero: cover image, date / category meta, and page title.
 */
const NewsDetailHeader = ({
  image,
  imageAlt = '',
  date = '',
  dateTime = '',
  category = '',
  title = '',
  imageRadius = '2xl',
  iconColor = '600',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!title && !image) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const radiusClass = IMAGE_RADIUS[imageRadius] || IMAGE_RADIUS['2xl']

  return (
    <header className="flex flex-col gap-5 md:gap-6">
      {image ? (
        <div className={`overflow-hidden ${radiusClass}`}>
          <img loading="lazy" decoding="async"
            src={image}
            alt={imageAlt}
            className="aspect-[16/10] w-full object-cover sm:aspect-[2/1]"
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-4 md:gap-5">
        <div
          className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${typography.caption} ${CMS_TEXT_HOVER_CLASS}`}
          style={getTextStyleVars(textStyle, 'metaColor', '600', 'normal')}
        >
          <span className="inline-flex items-center gap-1.5">
            <Clock
              size={16}
              weight="regular"
              className="shrink-0"
              style={{ color: colorVar(iconColor) }}
              aria-hidden
            />
            <time dateTime={dateTime}>{date}</time>
          </span>
          <span aria-hidden className="text-500">
            ·
          </span>
          <span
            className={`rounded-full bg-secondary-1/15 px-3 py-1 font-medium ${typography.caption} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(textStyle, 'chipText', 'primary-1', 'medium')}
          >
            {category}
          </span>
        </div>

        {title ? (
          <h1
            className={`m-0 font-semibold ${typography.pageTitle} ${CMS_TEXT_HOVER_CLASS}`}
            style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'semibold')}
          >
            <LinkedText text={title} {...linkProps} />
          </h1>
        ) : null}
      </div>
    </header>
  )
}

export default NewsDetailHeader
