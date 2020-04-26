import * as React from 'react'
import flatten from 'lodash/fp/flatten'
import map from 'lodash/fp/map'
import flow from 'lodash/fp/flow'

import Icon from './bricks/icon'
import AtlasImage from './atlas-region'
import { useStore, Widget, TileSetMap } from '../store'
import { toHexString } from '../util/color'
import HexagonElement from './bricks/hexagon'

interface CurrentTileProps {
  tileSets: TileSetMap
}

function CurrentTile({ tileSets }: CurrentTileProps) {
  let selectedTileColor = useStore(state => state.selectedTileColor)
  let selectedTileSprite = useStore(state => state.selectedTileSprite)
  let toggleWidget = useStore(state => state.toggleWidget)

  return (
    <div className='flex flex-col bg-gray-800 h-24 w-24 mb-1 rounded-full p-3 items-center'>
      <div className=''>
        {selectedTileSprite ? (
          <AtlasImage
            tileSet={selectedTileSprite.tileSet}
            region={tileSets[selectedTileSprite.tileSet].atlas[selectedTileSprite.tileImage]}
            scale={0.4}
          />
        ) : (
          <HexagonElement
            size={48}
            cssColor={`#${toHexString(selectedTileColor)}`}
            className='cursor-pointer'
            title='Base Tile Color'
            onClick={() => toggleWidget(Widget.ColorPicker)}
          />
        )}
      </div>
      <div
        className='mt-1 w-8 h-6 cursor-pointer'
        title='Base Tile Color'
        style={{ backgroundColor: `#${toHexString(selectedTileColor)}` }}
        onClick={() => toggleWidget(Widget.ColorPicker)}
      />
    </div>
  )
}

export default function Dock() {
  let tileSets = useStore(state => state.mapData.tileSets)
  let setSelectedTileImage = useStore(state => state.setSelectedTileSprite)

  let tiles = flow(
    Object.entries,
    map(([tileSet, { atlas }]) => (
      map(([name, region]) => ({ tileSet, name, region }))(Object.entries(atlas))
    )),
    flatten,
  )(tileSets)

  return (
    <div className='flex flex-row justify-around w-2/3 m-auto absolute left-0 right-0 bottom-0 items-end'>
      <style>
        {Object.entries(tileSets).map(([id, tileSet]) => ` .tileset-bg-${id} { background-image: url('${tileSet.image}');} `)}
      </style>
      <CurrentTile tileSets={tileSets} />
      <div className='w-2/3 flex-grow ml-2 mb-3 p-2 rounded-sm bg-gray-900 flex flex-row justify-between items-center'>
        <Icon className='cursor-pointer text-gray-400 text-2xl px-2 hover:text-gray-200' type='fa-broom' title='Clear Selected Image' onClick={() => setSelectedTileImage(undefined)} />
        <div className='w-full flex flex-row items-left overflow-x-scroll'>
          {tiles.map(({ tileSet, name, region }) => (
            <div className='cursor-pointer m-1' key={name}>
              <AtlasImage tileSet={tileSet} region={region} scale={0.3} onClick={() => setSelectedTileImage({ tileSet, tileImage: name })} />
            </div>
          ))}
        </div>
        <Icon className='cursor-pointer text-gray-400 text-2xl px-3 hover:text-gray-200' type='fa-bars' />
      </div>
    </div>
  )
}
