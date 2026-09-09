import umayyadImg from '../../../assets/images/flights-to-damascus/umayyad.png'
import oldCityImg from '../../../assets/images/flights-to-damascus/old-city.png'
import souqImg from '../../../assets/images/flights-to-damascus/souq.png'
import umayyadThumb1 from '../../../assets/images/flights-to-damascus/umayyad-thumb-1.png'
import umayyadThumb2 from '../../../assets/images/flights-to-damascus/umayyad-thumb-2.png'
import umayyadThumb3 from '../../../assets/images/flights-to-damascus/umayyad-thumb-3.png'
import umayyadThumb4 from '../../../assets/images/flights-to-damascus/umayyad-thumb-4.png'
import umayyadThumb5 from '../../../assets/images/flights-to-damascus/umayyad-thumb-5.png'
import oldCityThumb1 from '../../../assets/images/flights-to-damascus/old-city-thumb-1.png'
import oldCityThumb2 from '../../../assets/images/flights-to-damascus/old-city-thumb-2.png'
import oldCityThumb3 from '../../../assets/images/flights-to-damascus/old-city-thumb-3.png'
import oldCityThumb4 from '../../../assets/images/flights-to-damascus/old-city-thumb-4.png'
import oldCityThumb5 from '../../../assets/images/flights-to-damascus/old-city-thumb-5.png'
import souqThumb1 from '../../../assets/images/flights-to-damascus/souq-thumb-1.png'
import souqThumb2 from '../../../assets/images/flights-to-damascus/souq-thumb-2.png'
import souqThumb3 from '../../../assets/images/flights-to-damascus/souq-thumb-3.png'
import souqThumb4 from '../../../assets/images/flights-to-damascus/souq-thumb-4.png'
import souqThumb5 from '../../../assets/images/flights-to-damascus/souq-thumb-5.png'

/**
 * Landmark feature blocks, rendered in order down the page.
 * - `dark`  → full-bleed photo with a frosted-glass copy card floating over it.
 * - `light` → sand-coloured split section: photo on the start side, copy on the end.
 * `imageStart` only applies to the light variant (photo leading vs. trailing).
 */
export const landmarks = [
  {
    id: 'oldCity',
    variant: 'light',
    imageStart: true,
    image: oldCityImg,
    thumbnails: [oldCityThumb1, oldCityThumb2, oldCityThumb3, oldCityThumb4, oldCityThumb5],
  },
  {
    id: 'umayyad',
    variant: 'dark',
    image: umayyadImg,
    thumbnails: [umayyadThumb1, umayyadThumb2, umayyadThumb3, umayyadThumb4, umayyadThumb5],
  },

  {
    id: 'souq',
    variant: 'dark',
    image: souqImg,
    thumbnails: [souqThumb1, souqThumb2, souqThumb3, souqThumb4, souqThumb5],
  },
]
