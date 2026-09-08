import RouteAirportPicker from './RouteAirportPicker.jsx'

/**
 * From / To pickers floating over the map. Clear lives in the same bar so the
 * control reads as one field, not a second floating card.
 */
const RouteSearchPanel = ({ from, to, onChange, onReset }) => (
  <RouteAirportPicker
    from={from?.code}
    to={to?.code}
    onChange={onChange}
    onReset={onReset}
  />
)

export default RouteSearchPanel
