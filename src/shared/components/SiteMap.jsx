import { Fragment } from 'react'
import LocalizedLink from './LocalizedLink.jsx'
import { CMS_TEXT_HOVER_CLASS, getTextStyleVars } from '../../styles/cmsStyle.js'

const cx = (...parts) => parts.filter(Boolean).join(' ')

const LINK_ROW = 'flex flex-col gap-0.5 md:flex-row md:flex-wrap md:items-center md:gap-6'

const LINK_ITEM =
  'text-base font-medium leading-[26px] no-underline hover:underline max-md:flex max-md:min-h-[42px] max-md:w-full max-md:items-center max-md:py-2'

// Section/group titles link only when the editor picked a page or URL for them.
function TitleText({ href, children }) {
  if (!href) return children
  return (
    <LocalizedLink href={href} className="no-underline hover:underline">
      {children}
    </LocalizedLink>
  )
}

function LinkRow({ links, style }) {
  if (!links?.length) return null
  const linkStyle = getTextStyleVars(style, 'linkColor', 'primary-1', 'medium')
  return (
    <div className={LINK_ROW}>
      {links.map((link, index) => (
        <LocalizedLink
          key={`${link.label}-${index}`}
          href={link.href || '#'}
          className={cx(LINK_ITEM, CMS_TEXT_HOVER_CLASS)}
          style={linkStyle}
        >
          {link.label}
        </LocalizedLink>
      ))}
    </div>
  )
}

/**
 * Site map directory. Desktop links sit in a wrapping row. Below md they
 * stack, matching the mobile frame (min height 42, gold section rule).
 */
const SiteMap = ({
  crumbs = [],
  title = '',
  description = '',
  sections = [],
  ...style
}) => {
  if (!title && !description && !sections.length && !crumbs.length) return null

  const groupsOf = (section) => (Array.isArray(section.groups) ? section.groups : [])
  const hasGroupTitles = (section) => groupsOf(section).some((group) => group.title)

  return (
    <section className="flex w-full flex-col gap-7 pb-10 pt-6 md:gap-10 md:pb-20">
      {crumbs.length ? (
        <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => {
            const current = index === crumbs.length - 1
            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 ? (
                  <span
                    className={CMS_TEXT_HOVER_CLASS}
                    style={getTextStyleVars(style, 'crumbColor', '600', 'medium')}
                  >
                    /
                  </span>
                ) : null}
                <LocalizedLink
                  href={crumb.href || '#'}
                  className={cx('no-underline', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(
                    style,
                    current ? 'focusColor' : 'crumbColor',
                    current ? 'primary-1' : '600',
                    current ? 'semibold' : 'medium',
                  )}
                  aria-current={current ? 'page' : undefined}
                >
                  {crumb.label}
                </LocalizedLink>
              </Fragment>
            )
          })}
        </nav>
      ) : null}

      {title || description ? (
        <div className="flex flex-col gap-4">
          {title ? (
            <h1
              className={cx(
                'm-0 text-[40px] font-bold leading-[48px] md:text-[64px] md:leading-[72px]',
                CMS_TEXT_HOVER_CLASS,
              )}
              style={getTextStyleVars(style, 'titleColor', 'primary-1', 'bold')}
            >
              {title}
            </h1>
          ) : null}
          {description ? (
            <p
              className={cx('m-0 text-base font-normal leading-6', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'descriptionColor', '700', 'normal')}
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      {sections.length ? (
        <div className="flex w-full flex-col gap-7 rounded-[10px] border border-[#f3f4f6] bg-white px-5 py-7 md:gap-8 md:px-[66px] md:py-[72px]">
          {sections.map((section, index) => (
            <section key={`${section.title}-${index}`} className="flex flex-col gap-4 md:gap-8">
              <div className="flex flex-col gap-4 md:gap-6">
                {section.title ? (
                  <h2
                    className={cx(
                      'm-0 border-s-[3px] border-secondary ps-2.5 text-[22px] font-semibold leading-[30px] md:px-2 md:text-[28px] md:leading-normal',
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={getTextStyleVars(style, 'sectionTitleColor', '700', 'semibold')}
                  >
                    <TitleText href={section.href}>{section.title}</TitleText>
                  </h2>
                ) : null}
                {hasGroupTitles(section) ? (
                  <div className="flex w-full flex-col gap-6">
                    {groupsOf(section).map((group, groupIndex) => (
                      <div
                        key={`${group.title}-${groupIndex}`}
                        className="flex flex-col gap-2 md:gap-6"
                      >
                        {group.title ? (
                          <p
                            className={cx(
                              'm-0 text-base font-semibold leading-[26px]',
                              CMS_TEXT_HOVER_CLASS,
                            )}
                            style={getTextStyleVars(style, 'groupTitleColor', '700', 'semibold')}
                          >
                            <TitleText href={group.href}>{group.title}</TitleText>
                          </p>
                        ) : null}
                        <LinkRow links={group.links} style={style} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <LinkRow links={groupsOf(section)[0]?.links} style={style} />
                )}
              </div>
              <div className="h-px w-full bg-[#f3f4f6]" />
            </section>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default SiteMap
