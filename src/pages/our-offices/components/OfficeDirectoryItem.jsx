import { Clock, EnvelopeSimple, MapPin, MapPinLine, Phone } from '@phosphor-icons/react'
import { typography } from '../../../styles/typography.js'
import { CMS_TEXT_HOVER_CLASS, colorVar, getTextStyleVars } from '../../../styles/cmsStyle.js'
import LinkedText from '../../../shared/components/backlinks/LinkedText.jsx'

const cx = (...parts) => parts.filter(Boolean).join(' ')

export function toPhoneHref(phone = '') {
  const cleaned = String(phone).replace(/[^+\d]/g, '')
  return cleaned ? `tel:${cleaned}` : ''
}

export function toEmailHref(email = '') {
  const value = String(email).trim()
  return value ? `mailto:${value}` : ''
}

function ContactRow({ icon: Icon, color, children }) {
  return (
    <div
      className={cx('flex items-start gap-2 md:gap-3 min-w-0', typography.caption)}
      style={{ color }}
    >
      <Icon size={16} weight="regular" className="mt-0.5 shrink-0" style={{ color }} aria-hidden />
      <span className="min-w-0 break-words">{children}</span>
    </div>
  )
}

const OfficeDirectoryItem = ({
  office,
  labels,
  isLast,
  style = {},
  links = [],
  showLinks = true,
  linkProps = {},
}) => {
  const rowColor = colorVar(style.rowColor || '800')
  const buttonColor = colorVar(style.buttonColor || 'primary-1')

  const button = (Icon, label, href) => (
    <a
      href={href || undefined}
      className={cx(
        typography.button,
        'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 font-medium no-underline transition-colors hover:bg-100 md:flex-none md:gap-2.5 md:px-6 md:py-2.5',
        CMS_TEXT_HOVER_CLASS,
      )}
      style={{
        ...getTextStyleVars(style, 'buttonColor', 'primary-1', 'semibold'),
        borderColor: buttonColor,
      }}
    >
      <Icon size={16} weight="regular" className="shrink-0" aria-hidden />
      {label}
    </a>
  )

  return (
    <div>
      <div className="flex items-start gap-3 py-6 md:gap-6 md:py-8">
        {style.showPin && (
          <div className="relative z-10 flex w-9 shrink-0 justify-center md:w-11">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11"
              style={{ backgroundColor: colorVar(style.pinBg || 'secondary-700') }}
            >
              <MapPinLine
                size={22}
                weight="regular"
                aria-hidden
                style={{ color: colorVar(style.pinColor || '700') }}
              />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex min-w-0 flex-col gap-3 md:gap-4">
            <h3
              className={cx(typography.itemTitle, 'm-0', CMS_TEXT_HOVER_CLASS)}
              style={getTextStyleVars(style, 'nameColor', '700', 'semibold')}
            >
              <LinkedText text={office.name} {...linkProps} />
            </h3>
            <div className="flex min-w-0 flex-col gap-2 md:gap-2.5">
              {office.address && (
                <ContactRow icon={MapPin} color={rowColor}>
                  <LinkedText text={office.address} {...linkProps} />
                </ContactRow>
              )}
              {office.phone && (
                <ContactRow icon={Phone} color={rowColor}>
                  <span dir="ltr">{office.phone}</span>
                </ContactRow>
              )}
              {office.email && (
                <ContactRow icon={EnvelopeSimple} color={rowColor}>
                  <a
                    href={toEmailHref(office.email)}
                    className={cx('no-underline hover:underline', CMS_TEXT_HOVER_CLASS)}
                    style={getTextStyleVars(style, 'rowColor', '800', 'normal')}
                  >
                    {office.email}
                  </a>
                </ContactRow>
              )}
              {office.hours && (
                <ContactRow icon={Clock} color={rowColor}>
                  <LinkedText text={office.hours} {...linkProps} />
                </ContactRow>
              )}
              {style.showWeekend && office.weekend && (
                <span
                  className={cx(typography.caption, 'ps-7', CMS_TEXT_HOVER_CLASS)}
                  style={getTextStyleVars(style, 'rowColor', '800', 'normal')}
                >
                  {labels.weekendLabel}: <LinkedText text={office.weekend} {...linkProps} />
                </span>
              )}
            </div>
          </div>

          {style.showButtons && (
            <div className="flex w-full items-center gap-2 md:w-auto md:gap-4">
              {button(Phone, labels.callLabel, toPhoneHref(office.phone))}
              {button(EnvelopeSimple, labels.emailLabel, toEmailHref(office.email))}
            </div>
          )}
        </div>
      </div>

      {!isLast && (
        <hr
          className="m-0 border-none border-t ms-12 md:ms-[4.25rem]"
          style={{ borderColor: colorVar(style.dividerColor || '200') }}
        />
      )}
    </div>
  )
}

export default OfficeDirectoryItem
