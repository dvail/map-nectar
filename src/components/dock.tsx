import * as React from 'react'
import noop from 'lodash/noop'
import { RGBColor } from 'react-color'

import Icon from './bricks/icon'
import AtlasImage from './atlas-region'
import { useStore, tileInFavorites, Widget, TileSetMap, TileSprite } from '../store'
import { toHexString } from '../util/color'
import HexagonElement from './bricks/hexagon'

interface CurrentTileProps {
  tileSets: TileSetMap
}

interface HexTileProps {
  tileSets: TileSetMap
  tileSprite: TileSprite | null
  tileColor: RGBColor
  className?: string
  onClick?(event: React.MouseEvent): void
  onHexClick?(event: React.MouseEvent): void
  onSideClick?(event: React.MouseEvent): void
}

function HexTile({ className = '', tileSets, tileSprite, tileColor, onClick = noop, onHexClick = noop, onSideClick = noop }: HexTileProps) {
  return (
    <div onClick={onClick} className={`${className} flex flex-col items-center`}>
      <div className=''>
        {tileSprite ? (
          <AtlasImage
            tileSet={tileSprite.tileSet}
            region={tileSets[tileSprite.tileSet]?.atlas[tileSprite.tileImage]}
            scale={0.4}
            onClick={onHexClick}
          />
        ) : (
          <HexagonElement
            size={48}
            cssColor={`#${toHexString(tileColor)}`}
            className='cursor-pointer'
            title='Tile Image'
            onClick={onHexClick}
          />
          )}
      </div>
      <div
        className='mt-1 w-8 h-6 cursor-pointer'
        title='Base Tile Color'
        style={{ backgroundColor: `#${toHexString(tileColor)}` }}
        onClick={onSideClick}
      />
    </div>
  )
}

function CurrentTile({ tileSets }: CurrentTileProps) {
  let favorites = useStore(state => state.mapData.editor.favorites)
  let selectedTileColor = useStore(state => state.selectedTileColor)
  let selectedTileSprite = useStore(state => state.selectedTileSprite)
  let toggleFavorite = useStore(state => state.toggleFavorite)
  let toggleWidget = useStore(state => state.toggleWidget)

  let inFavorites = tileInFavorites(selectedTileColor, selectedTileSprite, favorites)

  return (
    <div className='bg-gray-800 h-32 w-32 p-3 pt-2 mb-1 rounded-full'>
      <div className='text-right'>
        <Icon
          type='fa fa-heart'
          className={
            `rounded-full p-2 text-xl bg-gray-800 cursor-pointer
          ${inFavorites
              ? 'text-pink-500'
              : 'text-gray-700 hover:text-pink-400'}`
          }
          title='Add to Favorites'
          onClick={() => toggleFavorite(selectedTileColor, selectedTileSprite)}
        />
      </div>
      <div style={{ marginTop: '-8px' }}>
        <HexTile
          tileSets={tileSets}
          tileSprite={selectedTileSprite}
          tileColor={selectedTileColor}
          onHexClick={() => toggleWidget(Widget.ImagePicker)}
          onSideClick={() => toggleWidget(Widget.ColorPicker)}
        />
      </div>
    </div>
  )
}

export default function Dock() {
  let tileSets = useStore(state => state.mapData.tileSets)
  let favorites = useStore(state => state.mapData.editor.favorites)
  let setSelectedTileImage = useStore(state => state.setSelectedTileSprite)
  let setSelectedTileColor = useStore(state => state.setSelectedTileColor)

  return (
    <div className='flex flex-row justify-around w-2/3 m-auto absolute left-0 right-0 bottom-0 items-end'>
      <style>
        {Object.entries(tileSets).map(([id, tileSet]) => ` .tileset-bg-${id} { background-image: url('${tileSet.image}');} `)}
      </style>
      <CurrentTile tileSets={tileSets} />
      <div className='w-2/3 flex-grow ml-2 mb-3 p-2 rounded-sm bg-gray-900 flex flex-row justify-between items-center'>
        <Icon className='cursor-pointer text-gray-400 text-2xl px-2 pr-4 hover:text-gray-200' type='fa-broom' title='Clear Selected Image' onClick={() => setSelectedTileImage(null)} />
        <div className='w-full flex flex-row items-left overflow-x-scroll'>
          {/* TODO This is a sign that the way favorites are handled needs to change - possibly use an actual ID */}
          {favorites.map(({ visual: { tileSprite, color } }) => (
            <HexTile
              key={`${tileSprite?.tileSet ?? ''}${tileSprite?.tileImage ?? ''}${color.r}${color.g}${color.b}`}
              className='mx-2 mb-2'
              tileSets={tileSets}
              tileSprite={tileSprite}
              tileColor={color}
              onClick={() => {
                setSelectedTileImage(tileSprite)
                setSelectedTileColor(color)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
