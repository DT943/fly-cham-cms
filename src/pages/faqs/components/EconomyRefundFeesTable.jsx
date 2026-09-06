import { ArrowUUpLeft, ArrowsClockwise, Clock, EyeSlash } from '@phosphor-icons/react'
import { economyRefundFeesTable } from '../utils/economyRefundFees.js'
import FareInfoTable from './FareInfoTable.jsx'

const rowIcons = {
  refundBefore24h: ArrowUUpLeft,
  refundWithin24h: Clock,
  noShow: EyeSlash,
  changeWithin24h: ArrowsClockwise,
}

const EconomyRefundFeesTable = ({ language }) => (
  <FareInfoTable table={economyRefundFeesTable} language={language} icons={rowIcons} />
)

export default EconomyRefundFeesTable
