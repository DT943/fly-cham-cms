import cover from '../../../assets/images/city-sights/magazine-cover.jpg'
import spreadOne from '../../../assets/images/city-sights/magazine-spread-1.jpg'
import spreadTwo from '../../../assets/images/city-sights/magazine-spread-2.jpg'

/**
 * Three magazine covers in a layered row: center issue in front, side issues
 * scaled down, faded, and tucked behind. `compact` scales the cluster for mobile.
 */
const MagazineFanCluster = ({ compact = false, className = '' }) => {
  const centerSize = compact
    ? 'h-32 w-24 rounded-md md:h-36 md:w-27'
    : 'h-52 w-39 rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.28)]'
  const sideSize = compact
    ? 'h-26 w-20 rounded-md md:h-30 md:w-23'
    : 'h-40 w-30 rounded-lg opacity-70 shadow-[0_8px_24px_rgba(0,0,0,0.18)]'
  const stageSize = compact ? 'h-36 w-56 md:h-40 md:w-64' : 'h-56 w-64 md:w-72'

  return (
    <div
      className={`pointer-events-none relative flex shrink-0 items-center justify-center ${stageSize} ${className}`}
    >
      <img
        src={spreadOne}
        alt=""
        className={`absolute z-0 object-cover ${sideSize} -translate-x-[68%] rtl:translate-x-[68%]`}
      />
      <img src={cover} alt="" className={`relative z-20 object-cover ${centerSize}`} />
      <img
        src={spreadTwo}
        alt=""
        className={`absolute z-10 object-cover ${sideSize} translate-x-[68%] rtl:-translate-x-[68%]`}
      />
    </div>
  )
}

export default MagazineFanCluster
