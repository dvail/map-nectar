import React, { useState } from 'react'
import first from 'lodash/first'
import uuidv4 from 'uuid/v4'

import { useStore } from '../store'
import { saveObject } from '../util'
import FaIcon from './faIcon'

function onMapLoad(mapLoad, files) {
  let file = first(files)
  let reader = new FileReader()

  reader.onload = event => {
    mapLoad(JSON.parse(event.target.result))
  }

  reader.readAsText(file)
}

export default function Sidebar() {
  let mapData = useStore(state => state.mapData)
  let toggleTileBuilder = useStore(state => state.toggleTileBuilder)
  let toggleColorPicker = useStore(state => state.toggleColorPicker)
  let mapLoad = useStore(state => state.mapLoad)

  let [saveInputId] = useState(uuidv4())

  return (
    <div className='bg-gray-900 text-xl p-3 pr-8 flex flex-col justify-between font-mono'>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center cursor-pointer' onClick={toggleTileBuilder}>
          <FaIcon className='text-xl w-8' type='fa-magic' title='Create New Tile' />
          <span className='text-white whitespace-no-wrap'>Build Tile</span>
        </div>
        <div className='flex flex-row items-center cursor-pointer' onClick={toggleColorPicker}>
          <FaIcon className='text-xl w-8' type='fa-eye-dropper' title='Choose tile color' />
          <span className='text-white whitespace-no-wrap'>Tile Color</span>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center cursor-pointer' onClick={() => saveObject(mapData, 'map.json')}>
          <FaIcon className='text-xl w-8' type='fa-save' title='Save Map' />
          <span className='text-white whitespace-no-wrap'>Save Map</span>
        </div>
        <div>
          <input className='hidden' id={saveInputId} type='file' onChange={e => onMapLoad(mapLoad, e.target.files)} />
          <label className='flex flex-row items-center cursor-pointer' htmlFor={saveInputId}>
            <FaIcon className='text-xl w-8' type='fa-file-upload' title='Load Map' />
            <span className='text-white whitespace-no-wrap'>Load Map</span>
          </label>
        </div>
      </div>
    </div>
  )
}
