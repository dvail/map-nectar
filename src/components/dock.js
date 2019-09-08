import m from 'mithril'

import FaIcon from './faIcon'
import AtlasRegion from './atlasRegion'
import completePng from '../../res/hexagonTerrain_sheet.png'
import completeJson from '../../res/hexagonTerrain_sheet.json'
import { tw } from '../util'

let DockStyle = tw`
  h-12 w-2/3
  mb-1 m-auto
  p-2
  absolute
  left-0 right-0 bottom-0
  rounded-sm
  bg-gray-900
  flex flex-row justify-between items-center
`

let RegionsStyle = tw`flex flex-row items-left`
let AtlasStyle = tw`cursor-pointer m-1`

export default function Dock() {
  let image = completePng
  let atlas = completeJson
  // TODO Remove hard coded
  let regionsNames = ["dirt_02.png", "dirt_03.png", "dirt_04.png"]

  function view({ attrs: { states, actions } }) {
    let Regions = regionsNames.map(region => m(
      AtlasStyle,
      m(AtlasRegion, { states, actions, region, image, atlas, scale: 0.3 }),
    ))

    return m(
      DockStyle,
      m(RegionsStyle, Regions),
      m(FaIcon, { type: 'fa-bars' }),
    )
  }

  return {
    view,
  }
}
