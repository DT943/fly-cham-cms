import { TrolleySuitcase } from '@phosphor-icons/react'
import { economyCheckedBaggageTable } from '../utils/economyCheckedBaggage.js'
import FareInfoTable from './FareInfoTable.jsx'

const rowIcons = {
  checked: TrolleySuitcase,
}

const EconomyCheckedBaggageTable = ({ language }) => (
  <FareInfoTable table={economyCheckedBaggageTable} language={language} icons={rowIcons} />
)

export default EconomyCheckedBaggageTable
