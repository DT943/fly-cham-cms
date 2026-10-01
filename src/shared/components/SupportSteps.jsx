import { Fragment } from 'react'
import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import { CaretRightIcon } from '@phosphor-icons/react'
import LocalizedLink from './LocalizedLink.jsx'
import LinkedText from './backlinks/LinkedText.jsx'

const RADIUS_CLASS = {
  none: 'rounded-none',
  lg: 'rounded-2xl',
  xl: 'rounded-[20px]',
}
const SECTION_PADDING = {
  none: '',
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const TITLE_SIZE = 'whitespace-pre-wrap text-2xl leading-snug md:text-[28px] md:leading-[normal] lg:text-[32px]'
const BODY_SIZE = 'text-sm leading-[1.5]'
const STEP_TITLE_SIZE = 'text-sm leading-[normal]'
const STEP_DESCRIPTION_SIZE = 'text-xs leading-[1.4]'
const LINK_SIZE = 'text-sm leading-[normal]'
const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Title, description, and horizontal icon steps beside a photo (Figma 40442:20788).
 */
const SupportSteps = ({
  title = '',
  description = '',
  imageUrl = '',
  imageAlt = '',
  imageCaption = '',
  items = [],
  imageSide = 'right',
  imageRadius = 'xl',
  sectionPadding = 'none',
  showSectionBg = false,
  sectionBg = '100',
  showIcon = true,
  iconBg = 'primary-1',
  iconColor = '50',
  showStepBadge = false,
  badgeBg = 'secondary',
  badgeColor = '50',
  showConnectors = true,
  connectorColor = '700',
  showLink = true,
  showLinkIcon = true,
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  if (!title && !description && !items.length && !imageUrl) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }
  const imageFirst = imageSide === 'left'
  const radiusClass = RADIUS_CLASS[imageRadius] ?? RADIUS_CLASS.xl

  return (
    <section
      className={cx('w-full min-w-0', SECTION_PADDING[sectionPadding] ?? '')}
      style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}
    >
      <div className={cx('flex flex-col items-center gap-8 lg:justify-between lg:gap-[50px]', imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row')}>
        <div className="flex w-full min-w-0 flex-col gap-8 lg:w-[686px] lg:max-w-[686px] lg:shrink lg:gap-10">
          {title || description ? (
            <div className="flex flex-col gap-3">
              {title ? (
                <h2 className={cx('m-0', TITLE_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'titleColor', '700', 'semibold')}>
                  <LinkedText text={title} {...linkProps} />
                </h2>
              ) : null}
              {description ? (
                <p className={cx('m-0', BODY_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'bodyColor', '600', 'normal')}>
                  <LinkedText text={description} {...linkProps} />
                </p>
              ) : null}
            </div>
          ) : null}
          {items.length ? (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-center lg:gap-5">
              {items.map((item, index) => {
                const Icon = showIcon && item.icon ? resolvePhosphorIcon(item.icon) : null
                const LinkIcon = showLink && showLinkIcon && item.linkIcon ? resolvePhosphorIcon(item.linkIcon) : null
                const showItemLink = showLink && item.linkLabel && item.href
                return (
                  <Fragment key={item.id || index}>
                    {index > 0 && showConnectors ? (
                      <CaretRightIcon
                        size={16}
                        aria-hidden
                        className="mt-6 hidden shrink-0 rtl:-scale-x-100 lg:block"
                        style={{ color: colorVar(connectorColor) || colorVar('700') }}
                      />
                    ) : null}
                    <article className="flex min-w-0 items-center gap-3 text-start lg:flex-1 lg:flex-col lg:gap-4 lg:text-center">
                      {Icon ? (
                        <span
                          className="relative flex size-12 shrink-0 items-center justify-center rounded-full border lg:size-16"
                          style={{
                            backgroundColor: colorVar(iconBg) || colorVar('primary-1'),
                            borderColor: colorVar(iconBg) || colorVar('primary-1'),
                          }}
                        >
                          {showStepBadge ? (
                            <span
                              className="absolute -left-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full text-[13px] font-semibold leading-none"
                              style={{
                                backgroundColor: colorVar(badgeBg) || colorVar('secondary'),
                                color: colorVar(badgeColor) || colorVar('50'),
                              }}
                            >
                              {index + 1}
                            </span>
                          ) : null}
                          <Icon size={20} aria-hidden className="lg:!size-6" style={{ color: colorVar(iconColor) || colorVar('50') }} />
                        </span>
                      ) : null}
                      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 lg:w-full lg:items-center lg:gap-1">
                        {item.title ? (
                          <h3 className={cx('m-0 w-full', STEP_TITLE_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'stepTitleColor', '700', 'semibold')}>
                            <LinkedText text={item.title} {...linkProps} />
                          </h3>
                        ) : null}
                        {item.description ? (
                          <p className={cx('m-0 w-full', STEP_DESCRIPTION_SIZE, CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(textStyle, 'stepDescriptionColor', '700', 'normal')}>
                            <LinkedText text={item.description} {...linkProps} />
                          </p>
                        ) : null}
                        {showItemLink ? (
                          <LocalizedLink
                            href={item.href}
                            className={cx('mt-1 inline-flex w-fit items-center gap-2 no-underline', LINK_SIZE, CMS_TEXT_HOVER_CLASS)}
                            style={getTextStyleVars(textStyle, 'buttonText', 'primary-1', 'semibold')}
                          >
                            <span>{item.linkLabel}</span>
                            {LinkIcon ? <LinkIcon size={16} aria-hidden className="shrink-0 rtl:-scale-x-100" /> : null}
                          </LocalizedLink>
                        ) : null}
                      </div>
                    </article>
                  </Fragment>
                )
              })}
            </div>
          ) : null}
        </div>
        {imageUrl ? (
          <div className={cx('relative h-[240px] w-full overflow-hidden lg:h-[420px] lg:w-[484px] lg:shrink-0', radiusClass)}>
            <img src={imageUrl} alt={imageAlt || ''} className={cx('size-full object-cover', radiusClass)} />
            {imageCaption ? (
              <p
                className="absolute bottom-8 right-8 m-0 -rotate-6 text-[28px] leading-none text-white rtl:left-8 rtl:right-auto rtl:rotate-6"
                style={{ fontFamily: '"Caveat Brush", cursive' }}
              >
                {imageCaption}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default SupportSteps
