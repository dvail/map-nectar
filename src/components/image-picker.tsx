import * as React from 'react'

import flatten from 'lodash/fp/flatten'
import map from 'lodash/fp/map'
import flow from 'lodash/fp/flow'
import { useStore } from '../store'
import AtlasImage from './atlas-region'

export default function ImagePicker() {
  let tileSets = useStore(state => state.mapData.tileSets)
  let setSelectedTileSprite = useStore(state => state.setSelectedTileSprite)

  let tiles = flow(
    Object.entries,
    map(([tileSet, { atlas }]) => (
      map(([name, region]) => ({ tileSet, name, region }))(Object.entries(atlas))
    )),
    flatten,
  )(tileSets)

  return (
    <div style={{ height: 'calc(100vh - 200px)' }} className='w-64 h-64 flex flex-row flex-wrap items-left overflow-y-scroll' onScroll={e => e.stopPropagation()}>
      {tiles.map(({ tileSet, name, region }) => (
        <div className='cursor-pointer m-2' key={name}>
          <AtlasImage tileSet={tileSet} region={region} scale={0.3} onClick={() => setSelectedTileSprite({ tileSet, tileImage: name })} />
        </div>
      ))}
    </div>
  )
}
