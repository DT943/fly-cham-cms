import { ArrowsClockwise, Clock } from '@phosphor-icons/react'
import { flightChangeFeesTable } from '../utils/flightChangeFees.js'
import FareInfoTable from './FareInfoTable.jsx'

const rowIcons = {
  before24h: ArrowsClockwise,
  within24h: Clock,
}

const FlightChangeFeesTable = ({ language }) => (
  <FareInfoTable table={flightChangeFeesTable} language={language} icons={rowIcons} />
)

export default FlightChangeFeesTable
