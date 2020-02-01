import React from 'react'
import FaIcon from './faIcon'
import AtlasRegion from './atlasRegion'
import completePng from '../../res/hexagonTerrain_sheet.png'
import completeJson from '../../res/hexagonTerrain_sheet.json'
import { useStore } from '../store'

// TODO Remove hard coded
const regionsNames = ["dirt_02.png", "dirt_03.png", "dirt_04.png"]

export default function Dock() {
  let image = completePng
  let atlas = completeJson
  let setSelectedTileImage = useStore(state => state.setSelectedTileImage)

  return (
    <div className='h-12 w-2/3 mb-1 m-auto p-2 absolute left-0 right-0 bottom-0 rounded-sm bg-gray-900 flex flex-row justify-between items-center'>
      <div className='flex flex-row items-left'>
        {regionsNames.map(region => (
          <div className='cursor-pointer m-1' key={region}>
            <AtlasRegion region={region} image={image} atlas={atlas} scale={0.3} onClick={() => setSelectedTileImage(region)} />
          </div>
        ))}
        <FaIcon type='fa-bars' />
      </div>
    </div>
  )
}
