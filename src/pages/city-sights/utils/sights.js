import {
  Bank,
  Image,
  Mosque,
  PingPong,
  ShoppingBagOpen,
  TreePalm,
} from '@phosphor-icons/react'

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
  { id: 'blueMosque', tags: ['religious', 'historic'] },
  { id: 'romanTheatre', tags: ['historic', 'culture'] },
  { id: 'dohaCorniche', tags: ['waterfront', 'familyFun'] },
  { id: 'flameTowers', tags: ['architecture', 'views'] },
  { id: 'eiffelTower', tags: ['landmark', 'iconic'] },
  { id: 'burjKhalifa', tags: ['skyscraper', 'panoramic'] },
  { id: 'operaHouse', tags: ['cultural', 'architectural'] },
  { id: 'colosseum', tags: ['historical', 'touristAttraction'] },
]
