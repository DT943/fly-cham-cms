import {
  Bank,
  Image,
  Mosque,
  PingPong,
  ShoppingBagOpen,
  TreePalm,
} from '@phosphor-icons/react'
import blueMosque from '../../../assets/images/city-sights/sight-blue-mosque.png'
import burjKhalifa from '../../../assets/images/city-sights/sight-burj-khalifa.png'
import colosseum from '../../../assets/images/city-sights/sight-colosseum.png'
import dohaCorniche from '../../../assets/images/city-sights/sight-doha-corniche.png'
import eiffelTower from '../../../assets/images/city-sights/sight-eiffel-tower.png'
import flameTowers from '../../../assets/images/city-sights/sight-flame-towers.png'
import operaHouse from '../../../assets/images/city-sights/sight-opera-house.png'
import romanTheatre from '../../../assets/images/city-sights/sight-roman-theatre.png'

/** Filter row above the grid. "All" is the selected pill and carries no icon. */
export const sightCategories = [
  { id: 'all' },
  { id: 'landmarks', icon: Image },
  { id: 'religion', icon: Mosque },
  { id: 'shopping', icon: ShoppingBagOpen },
  { id: 'activities', icon: PingPong },
  { id: 'nature', icon: TreePalm },
  { id: 'museums', icon: Bank },
]

/** Name, location and tag labels come from `citySights.sights.*` in the locales. */
export const sights = [
  { id: 'blueMosque', image: blueMosque, tags: ['religious', 'historic'] },
  { id: 'romanTheatre', image: romanTheatre, tags: ['historic', 'culture'] },
  { id: 'dohaCorniche', image: dohaCorniche, tags: ['waterfront', 'familyFun'] },
  { id: 'flameTowers', image: flameTowers, tags: ['architecture', 'views'] },
  { id: 'eiffelTower', image: eiffelTower, tags: ['landmark', 'iconic'] },
  { id: 'burjKhalifa', image: burjKhalifa, tags: ['skyscraper', 'panoramic'] },
  { id: 'operaHouse', image: operaHouse, tags: ['cultural', 'architectural'] },
  { id: 'colosseum', image: colosseum, tags: ['historical', 'touristAttraction'] },
]
