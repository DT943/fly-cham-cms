import { officeLocations } from '../utils/officeLocations.js'
import OfficeItem from './OfficeItem.jsx'

const OfficeList = ({ locationIds }) => (
  <div className="relative">
    <span
      aria-hidden="true"
      className="absolute top-8 bottom-8 start-0 w-11 flex justify-center pointer-events-none z-0"
    >
      <span className="block w-0.5 h-full bg-[repeating-linear-gradient(to_bottom,var(--color-secondary-700)_0_6px,transparent_6px_12px)]" />
    </span>
    {locationIds.map((locationId, index) => {
      const location = officeLocations[locationId]
      return (
        <OfficeItem
          key={locationId}
          locationId={locationId}
          phone={location.phone}
          email={location.email}
          isLast={index === locationIds.length - 1}
        />
      )
    })}
  </div>
)

export default OfficeList
