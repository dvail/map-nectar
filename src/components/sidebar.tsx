import * as React from 'react'
import first from 'lodash/first'

import { MapData, useStore, Widget } from '../store'
import { saveAsFile, saveLocal } from '../util/misc'
import Icon from './bricks/icon'
import FileInput from './bricks/file-input'

function onMapLoad(mapLoad: (payload: MapData) => void, files: FileList | null) {
  let file = first(files)
  if (!file) return

  let reader = new FileReader()

  reader.onload = event => {
    // TODO Validate parsed input here
    mapLoad(JSON.parse(event.target?.result as string))
  }

  reader.readAsText(file)
}

interface MenuItemProps {
  onClick(e: React.MouseEvent): void
  iconType: string
  title: string
  children: React.ReactNode
}

function MenuItem({ onClick, iconType, title, children }: MenuItemProps) {
  return (
    <div className='flex flex-row items-center cursor-pointer hover:text-pink-300' onClick={onClick}>
      <Icon className='w-8' type={iconType} title={title} />
      <span className='whitespace-no-wrap'>{children}</span>
    </div>
  )
}

export default function Sidebar() {
  let mapData = useStore(state => state.mapData)
  let setOpenWidget = useStore(state => state.toggleWidget)
  let mapLoad = useStore(state => state.mapLoad)

  return (
    <div className='bg-gray-800 text-lg text-white p-3 flex flex-col justify-between font-sans'>
      <div className='flex flex-col'>
        {/* <MenuItem onClick={() => setOpenWidget(Widget.TileBuilder)} iconType='fa-magic' title='Create New Tile'>Build Tile</MenuItem> */}
        <MenuItem onClick={() => setOpenWidget(Widget.ImagePicker)} iconType='fa-image' title='Choose tile image'>Tile Image</MenuItem>
        <MenuItem onClick={() => setOpenWidget(Widget.ColorPicker)} iconType='fa-eye-dropper' title='Choose tile color'>Tile Color</MenuItem>
        <MenuItem onClick={() => setOpenWidget(Widget.TileSetPane)} iconType='fa-th-large' title='Tile Sets'>
          <div className='flex flex-row justify-around'>
            <span>Tile Sets</span>
            <span className='inline-block rounded text-indigo-100 bg-indigo-500 px-2 ml-8'>
              {Object.entries(mapData.tileSets ?? {}).length}
            </span>
          </div>
        </MenuItem>
      </div>
      <div className='flex flex-col'>
        <MenuItem onClick={() => saveLocal(mapData)} iconType='fa-save' title='Save'>Save</MenuItem>
        <MenuItem onClick={() => setOpenWidget(Widget.SavedMapPane)} iconType='fa-map' title='View Maps'>View Maps</MenuItem>
        <div className='h-1 border-b-2 border-gray-700 my-2' />
        <MenuItem onClick={() => saveAsFile(mapData, 'map.json')} iconType='fa-save' title='Export'>Export</MenuItem>
        <FileInput className='hover:text-pink-300' onChange={e => onMapLoad(mapLoad, e.target.files)}>
          <Icon className='text-xl w-8' type='fa-file-upload' title='Import' />
          <span className='whitespace-no-wrap'>Import</span>
        </FileInput>
      </div>
    </div>
  )
}
