import { colorVar } from '../../../styles/cmsStyle.js'
import OfficeDirectoryItem from './OfficeDirectoryItem.jsx'

const OfficeDirectoryList = ({
  offices = [],
  labels,
  style = {},
  links = [],
  showLinks = true,
  linkProps = {},
}) => {
  const showPin = style.showPin !== false
  const showDashedLine = style.showDashedLine !== false
  const lineCss = colorVar(style.lineColor || 'secondary-700')

  return (
    <div className="relative">
      {showDashedLine && showPin && offices.length > 1 ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-6 bottom-0 start-0 z-0 flex w-9 justify-center md:top-8 md:w-11"
        >
          <span
            className="block h-full w-0.5"
            style={{
              backgroundImage: `repeating-linear-gradient(to bottom, ${lineCss} 0 6px, transparent 6px 12px)`,
            }}
          />
        </span>
      ) : null}

      {offices.map((office, index) => (
        <OfficeDirectoryItem
          key={`${office.name}-${index}`}
          office={office}
          labels={labels}
          isLast={index === offices.length - 1}
          style={style}
          links={links}
          showLinks={showLinks}
          linkProps={linkProps}
        />
      ))}
    </div>
  )
}

export default OfficeDirectoryList
