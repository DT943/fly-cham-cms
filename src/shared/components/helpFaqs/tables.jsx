import FareComparisonTables from '../../../pages/faqs/components/FareComparisonTables.jsx'
import FlightChangeFeesTable from '../../../pages/faqs/components/FlightChangeFeesTable.jsx'
import EconomyRefundFeesTable from '../../../pages/faqs/components/EconomyRefundFeesTable.jsx'
import EconomyCheckedBaggageTable from '../../../pages/faqs/components/EconomyCheckedBaggageTable.jsx'

const TABLES = {
  fareComparison: FareComparisonTables,
  flightChangeFees: FlightChangeFeesTable,
  economyRefundFees: EconomyRefundFeesTable,
  economyCheckedBaggage: EconomyCheckedBaggageTable,
}

export function getHelpFaqsTable(extra) {
  return TABLES[extra] || null
}
