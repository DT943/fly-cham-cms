import {
  CMS_TEXT_HOVER_CLASS,
  colorVar,
  getTextStyleVars,
} from '../../styles/cmsStyle.js'
import { resolvePhosphorIcon } from '../../cms/adapters/phosphorIcons.js'
import LinkedText from './backlinks/LinkedText.jsx'

const TILE_COLUMNS = {
  4: 'grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

/**
 * White travel-class card: eyebrow, title, and body beside a photo, with grey
 * icon tiles underneath. `imageSide` "left" is Economy; "right" is Business.
 */
const ClassPanel = ({
  eyebrow = '',
  title = '',
  description = '',
  imageUrl = '',
  imageAlt = '',
  items = [],
  imageSide = 'left',
  tileColumns = '4',
  links = [],
  showLinks = true,
  showEyebrow = true,
  ...style
}) => {
  const tiles = items.filter((item) => item?.title || item?.description || item?.icon)
  if (!eyebrow && !title && !description && !imageUrl && !tiles.length) return null
  const imageFirst = imageSide !== 'right'
  const linkProps = { links, enabled: showLinks }

  const copy = (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        {showEyebrow !== false && eyebrow ? (
          <p className={cx('m-0 text-base capitalize leading-[normal]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'eyebrowColor', 'primary-1', 'medium')}>
            <LinkedText text={eyebrow} {...linkProps} />
          </p>
        ) : null}
        {title ? (
          <h2 className={cx('m-0 text-3xl leading-[normal] md:text-4xl', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'titleColor', '700', 'semibold')}>
            <LinkedText text={title} {...linkProps} />
          </h2>
        ) : null}
      </div>
      {description ? (
        <p className={cx('m-0 whitespace-pre-line text-sm leading-normal', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'descriptionColor', '700', 'normal')}>
          <LinkedText text={description} {...linkProps} />
        </p>
      ) : null}
    </div>
  )

  const photo = imageUrl ? (
    <div className="aspect-[580/375] w-full shrink-0 overflow-hidden rounded-2xl lg:aspect-auto lg:h-[375px] lg:w-[580px]">
      <img src={imageUrl} alt={imageAlt || ''} className="size-full object-cover" />
    </div>
  ) : null

  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-white px-[18px] py-[30px] ">
      <div className={cx('flex flex-col items-center gap-8 lg:flex-row lg:gap-12', imageFirst ? '' : 'lg:flex-row-reverse')}>
        {photo}
        {copy}
      </div>
      {tiles.length ? (
        <div className={cx('grid gap-4', TILE_COLUMNS[tileColumns] || TILE_COLUMNS[4])}>
          {tiles.map((item, index) => {
            const Icon = item.icon ? resolvePhosphorIcon(item.icon) : null
            return (
              <div key={item.id || index} className="flex h-[120px] flex-col items-center justify-center gap-3 rounded-xl bg-[#f5f5f4] p-3 text-center">
                {Icon ? (
                  <span style={{ color: colorVar(style.iconColor || '700') }}>
                    <Icon size={33} weight="regular" aria-hidden />
                  </span>
                ) : null}
                <div>
                  {item.title ? (
                    <p className={cx('m-0 text-sm leading-[normal]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'cardTitleColor', '700', 'medium')}>
                      {item.title}
                    </p>
                  ) : null}
                  {item.description ? (
                    <p className={cx('m-0 text-xs leading-[normal]', CMS_TEXT_HOVER_CLASS)} style={getTextStyleVars(style, 'cardDescriptionColor', '700', 'medium')}>
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}

export default ClassPanel
