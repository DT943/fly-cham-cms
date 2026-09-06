import {
  ArrowUUpLeft,
  ArrowsClockwise,
  Briefcase,
  Clock,
  Coffee,
  EyeSlash,
  ForkKnife,
  Seat,
  TrolleySuitcase,
} from '@phosphor-icons/react'
import { fareComparisonTables } from '../utils/fareComparison.js'
import FareInfoTable from './FareInfoTable.jsx'

const rowIcons = {
  checked: TrolleySuitcase,
  carryOn: Briefcase,
  change: ArrowsClockwise,
  refund: ArrowUUpLeft,
  seat: Seat,
  beverage: Coffee,
  meal: ForkKnife,
  noShow: EyeSlash,
  within24h: Clock,
}

const FareComparisonTables = ({ language }) => (
  <FareInfoTable table={fareComparisonTables[0]} language={language} icons={rowIcons} />
)

export default FareComparisonTables
