import * as React from 'react'
import flatten from 'lodash/fp/flatten'
import map from 'lodash/fp/map'
import flow from 'lodash/fp/flow'

import Icon from './bricks/icon'
import AtlasRegion from './atlas-region'
import { useStore } from '../store'

export default function Dock() {
  let tileSets = useStore(state => state.mapData.tileSets)
  let setSelectedTileImage = useStore(state => state.setSelectedTileSprite)
  let tiles = flow(
    Object.entries,
    map(([tileSet, { atlas }]) =>
      map(([name, region]) => ({ tileSet, name, region }))(Object.entries(atlas))
    ),
    flatten
  )(tileSets)

  return (
    <div className='w-2/3 mb-1 m-auto p-2 absolute left-0 right-0 bottom-0 rounded-sm bg-gray-900 flex flex-row justify-between items-center'>
      <div className='w-full flex flex-row items-left overflow-x-scroll'>
        <style>
          {Object.entries(tileSets).map(([id, tileSet]) => ` .tileset-bg-${id} { background-image: url('${tileSet.image}');} `)}
        </style>
        {tiles.map(({ tileSet, name, region }) => (
          <div className='cursor-pointer m-1' key={name}>
            <AtlasRegion tileSet={tileSet} region={region} scale={0.3} onClick={() => setSelectedTileImage({ tileSet, tileImage: name })} />
          </div>
        ))}
        <Icon type='fa-bars' />
      </div>
    </div>
  )
}
