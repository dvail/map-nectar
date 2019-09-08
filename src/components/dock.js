import m from 'mithril'

import AtlasRegion from './atlasRegion'
import completePng from '../../res/hexagonTerrain_sheet.png'
import completeJson from '../../res/hexagonTerrain_sheet.json'
import { tw } from '../util'

let DockStyle = tw`
  h-12 w-2/3
  mb-1 m-auto
  absolute
  left-0 right-0 bottom-0
  rounded-sm
  bg-gray-900
`

export default function Dock() {
  function view({ attrs: { states, actions } }) {
    return m(
      DockStyle,
      m(
        AtlasRegion,
        {
          states,
          actions,
          image: completePng,
          atlas: completeJson,
          region: "dirt_03.png",
          scale: 0.3,
        },
      ),
    )
  }

  return {
    view,
  }
}
