import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Clock } from '@phosphor-icons/react'
import {
  CMS_TEXT_HOVER_CLASS,
  getTextStyleVars,
  colorVar,
  getButtonStyle,
} from '../../styles/cmsStyle.js'
import { typography } from '../../styles/typography.js'
import LinkedText from './backlinks/LinkedText.jsx'
import LocalizedLink from './LocalizedLink.jsx'
import Dropdown from './Dropdown.jsx'
import coverLatest from '../../assets/images/media-center/latest-news.jpg'
import coverTwo from '../../assets/images/media-center/news-grid-2.jpg'
import coverThree from '../../assets/images/media-center/news-grid-3.jpg'
import coverDamascus from '../../assets/images/our-destenations/damascus.jpeg'
import coverIstanbul from '../../assets/images/our-destenations/istanbul.jpg'
import coverDubai from '../../assets/images/our-destenations/dubai.jpg'

const COVER_BY_KEY = {
  latest: coverLatest,
  2: coverTwo,
  3: coverThree,
  damascus: coverDamascus,
  istanbul: coverIstanbul,
  dubai: coverDubai,
}

const COVER_CYCLE = ['latest', '2', '3', 'damascus', 'istanbul', 'dubai']

const COLUMNS = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

const CARD_GAP = {
  tight: 'gap-3',
  default: 'gap-4 md:gap-5',
  loose: 'gap-6 md:gap-8',
}

const SECTION_PADDING = {
  tight: 'py-4 md:py-6',
  default: 'py-6 md:py-10',
  loose: 'py-10 md:py-16',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * Recent News listing: page title, month/year filters, topic chips, year-grouped
 * cards, and pagination. Defaults match the static Recent News page.
 */
const RecentNews = ({
  title = '',
  description = '',
  filterLabel = '',
  monthLabel = '',
  yearLabel = '',
  searchLabel = '',
  previousLabel = '',
  nextLabel = '',
  months = [],
  years = [],
  topics = [],
  items = [],
  pageSize = 6,
  columns = '3',
  cardGap = 'default',
  sectionPadding = 'default',
  showSectionBg = false,
  sectionBg = '100',
  cardBg = '50',
  cardBorderColor = '200',
  iconColor = '600',
  searchBg = 'secondary',
  searchHoverBg,
  topicActiveBg = 'primary-1',
  topicInactiveBg = '200',
  pageActiveBg = 'primary-1',
  pageInactiveBg = 'transparent',
  navBg = '200',
  navDisabledBg = '200',
  links = [],
  showLinks = true,
  linkColor,
  linkHoverColor,
  linkFontWeight,
  linkUnderline,
  linkItalic,
  ...textStyle
}) => {
  const monthOptions = Array.isArray(months) ? months : []
  const yearOptions = Array.isArray(years) ? years : []
  const topicOptions = Array.isArray(topics) ? topics : []
  const articles = Array.isArray(items) ? items : []
  const size = Math.max(1, Number(pageSize) || 6)
  const searchBtn = getButtonStyle(
    { ...textStyle, searchBg, searchHoverBg },
    {
      bgKey: 'searchBg',
      bgHoverKey: 'searchHoverBg',
      bgFallback: 'secondary',
      bgHoverFallback: 'secondary-800',
      textKey: 'buttonText',
      textFallback: 'btn',
      weightFallback: 'semibold',
    },
  )

  const defaultTopic = topicOptions[0]?.id || 'all'
  const [activeTopic, setActiveTopic] = useState(defaultTopic)
  const [currentPage, setCurrentPage] = useState(1)
  const [month, setMonth] = useState(monthOptions[0]?.id || 'all')
  const [year, setYear] = useState(yearOptions[0]?.id || 'all')

  const handleTopicChange = (topic) => {
    setActiveTopic(topic)
    setCurrentPage(1)
  }

  const filteredArticles = useMemo(() => {
    if (!activeTopic || activeTopic === 'all') return articles
    return articles.filter((article) => article.topic === activeTopic)
  }, [activeTopic, articles])

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / size))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedArticles = useMemo(() => {
    const start = (safePage - 1) * size
    return filteredArticles.slice(start, start + size)
  }, [filteredArticles, safePage, size])

  const articlesByYear = useMemo(() => {
    return paginatedArticles.reduce((groups, article) => {
      const group = String(article.year || '')
      if (!group) {
        if (!groups['']) groups[''] = []
        groups[''].push(article)
        return groups
      }
      if (!groups[group]) groups[group] = []
      groups[group].push(article)
      return groups
    }, {})
  }, [paginatedArticles])

  if (!title && !description && !articles.length) return null

  const linkProps = {
    links,
    enabled: showLinks,
    linkColor,
    linkHoverColor,
    linkFontWeight,
    linkUnderline,
    linkItalic,
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  const inner = (
    <section className="flex flex-col gap-10 md:gap-14">
      <div className="flex flex-col gap-6 md:gap-8">
        {title || description ? (
          <header className="flex flex-col gap-4 md:gap-5">
            {title ? (
              <h1
                className={cx(
                  'm-0 font-bold leading-tight lg:text-[44px]',
                  typography.pageTitle,
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'titleColor', 'primary-1', 'bold')}
              >
                <LinkedText text={title} {...linkProps} />
              </h1>
            ) : null}
            {description ? (
              <p
                className={cx(
                  'm-0 w-full font-normal leading-relaxed md:text-lg',
                  typography.sectionDescription,
                  CMS_TEXT_HOVER_CLASS,
                )}
                style={getTextStyleVars(textStyle, 'descriptionColor', '700', 'normal')}
              >
                <LinkedText text={description} {...linkProps} />
              </p>
            ) : null}
          </header>
        ) : null}

        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            {filterLabel ? (
              <span
                className={cx('shrink-0 font-medium', typography.body, CMS_TEXT_HOVER_CLASS)}
                style={getTextStyleVars(textStyle, 'labelColor', '700', 'medium')}
              >
                {filterLabel}
              </span>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              {monthOptions.length ? (
                <Dropdown
                  label={monthLabel}
                  value={month}
                  onChange={setMonth}
                  options={monthOptions.map((option) => ({
                    value: option.id,
                    label: option.label,
                  }))}
                  className="min-w-0 flex-1"
                />
              ) : null}
              {yearOptions.length ? (
                <Dropdown
                  label={yearLabel}
                  value={year}
                  onChange={setYear}
                  options={yearOptions.map((option) => ({
                    value: option.id,
                    label: option.label,
                  }))}
                  className="min-w-0 flex-1"
                />
              ) : null}
            </div>

            {searchLabel ? (
              <button
                type="button"
                className={cx(
                  'h-12 w-full shrink-0 cursor-pointer rounded-lg border-0 px-10 font-semibold transition-colors md:w-auto md:min-w-[7.5rem]',
                  typography.button,
                  searchBtn.className,
                )}
                style={searchBtn.style}
              >
                {searchLabel}
              </button>
            ) : null}
          </div>

          {topicOptions.length ? (
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:gap-3">
              {topicOptions.map((topic) => {
                const isActive = topic.id === activeTopic
                return (
                  <button
                    key={topic.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleTopicChange(topic.id)}
                    className={cx(
                      'shrink-0 cursor-pointer rounded-lg border-0 px-4 py-2.5 font-medium transition-colors md:px-5 md:py-3',
                      typography.caption,
                      CMS_TEXT_HOVER_CLASS,
                    )}
                    style={{
                      backgroundColor: colorVar(isActive ? topicActiveBg : topicInactiveBg),
                      ...getTextStyleVars(
                        textStyle,
                        isActive ? 'chipActiveText' : 'tabText',
                        isActive ? '50' : 'primary-1',
                        'medium',
                      ),
                    }}
                  >
                    {topic.label}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        <div className="flex flex-col gap-8 md:gap-10">
          {Object.entries(articlesByYear).map(([group, groupArticles]) => (
            <div key={group || 'items'} className="flex flex-col gap-5 md:gap-6">
              {group ? (
                <h2
                  className={cx('m-0 font-semibold', typography.sectionTitle, CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(textStyle, 'sectionTitleColor', '800', 'semibold')}
                >
                  {group}
                </h2>
              ) : null}

              <div
                className={cx(
                  'grid',
                  COLUMNS[String(columns)] || COLUMNS[3],
                  CARD_GAP[cardGap] || CARD_GAP.default,
                )}
              >
                {groupArticles.map((article, index) => {
                  const href = article.href || '#'
                  const cover =
                    article.image ||
                    COVER_BY_KEY[article.coverKey] ||
                    COVER_BY_KEY[COVER_CYCLE[index % COVER_CYCLE.length]]
                  return (
                    <article
                      key={article.id || `${group}-${index}`}
                      className="flex h-full flex-col overflow-hidden rounded-2xl border"
                      style={{
                        backgroundColor: colorVar(cardBg),
                        borderColor: colorVar(cardBorderColor),
                      }}
                    >
                      <LocalizedLink href={href} className="block no-underline">
                        <img
                          src={cover}
                          alt={article.imageAlt || ''}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </LocalizedLink>

                      <div className="flex flex-1 flex-col gap-3 p-5 md:gap-4 md:p-6">
                        <div
                          className={cx(
                            'flex flex-wrap items-center gap-x-2 gap-y-1',
                            typography.caption,
                            CMS_TEXT_HOVER_CLASS,
                          )}
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
                            <time dateTime={article.dateTime}>{article.date}</time>
                          </span>
                          <span aria-hidden className="text-500">
                            ·
                          </span>
                          <span
                            className={cx(
                              'rounded-full bg-primary-1/10 px-3 py-1 font-medium',
                              typography.caption,
                              CMS_TEXT_HOVER_CLASS,
                            )}
                            style={getTextStyleVars(textStyle, 'chipText', 'primary-1', 'medium')}
                          >
                            {article.category}
                          </span>
                        </div>

                        {article.title ? (
                          <h2
                            className={cx('m-0 font-semibold', typography.itemTitle)}
                            style={getTextStyleVars(textStyle, 'cardTitleColor', 'primary-1', 'semibold')}
                          >
                            <LocalizedLink
                              href={href}
                              className="text-inherit no-underline hover:underline"
                            >
                              {article.title}
                            </LocalizedLink>
                          </h2>
                        ) : null}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <nav aria-label="Pagination" className="flex items-center justify-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label={previousLabel}
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(safePage - 1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border-0"
            style={{
              backgroundColor: colorVar(safePage <= 1 ? navDisabledBg : navBg),
              color: colorVar(safePage <= 1 ? '500' : '700'),
              cursor: safePage <= 1 ? 'default' : 'pointer',
            }}
          >
            <ArrowLeft size={18} className="rtl:-scale-x-100" />
          </button>

          {pages.map((page) => {
            const isActive = page === safePage
            return (
              <button
                key={page}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setCurrentPage(page)}
                className={cx(
                  'flex size-10 shrink-0 items-center justify-center rounded-full border-0',
                  typography.caption,
                  isActive ? 'font-semibold' : 'font-medium',
                )}
                style={{
                  backgroundColor: isActive ? colorVar(pageActiveBg) : pageInactiveBg === 'transparent' ? 'transparent' : colorVar(pageInactiveBg),
                  color: colorVar(isActive ? '50' : '700'),
                  cursor: isActive ? 'default' : 'pointer',
                }}
              >
                {page}
              </button>
            )
          })}

          <button
            type="button"
            aria-label={nextLabel}
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(safePage + 1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border-0"
            style={{
              backgroundColor: colorVar(safePage >= totalPages ? navDisabledBg : 'primary-1'),
              color: colorVar(safePage >= totalPages ? '500' : '50'),
              cursor: safePage >= totalPages ? 'default' : 'pointer',
            }}
          >
            <ArrowRight size={18} className="rtl:-scale-x-100" />
          </button>
        </nav>
      </div>
    </section>
  )

  const sectionClass = cx(
    SECTION_PADDING[sectionPadding] || '',
    showSectionBg ? 'rounded-2xl px-4 md:px-6' : '',
  )
  if (!sectionClass) return inner
  return (
    <div className={sectionClass} style={showSectionBg ? { backgroundColor: colorVar(sectionBg) } : undefined}>
      {inner}
    </div>
  )
}

export default RecentNews
