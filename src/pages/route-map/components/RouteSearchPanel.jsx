import RouteAirportPicker from './RouteAirportPicker.jsx'

/**
 * From / To / Search / Reset bar floating over the map.
 */
const RouteSearchPanel = ({ from, to, onChange, onReset, onSearch, searching = false }) => (
  <RouteAirportPicker
    from={from?.code}
    to={to?.code}
    onChange={onChange}
    onReset={onReset}
    onSearch={onSearch}
    searching={searching}
  />
)

export default RouteSearchPanel
