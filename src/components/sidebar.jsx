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
    <div className='bg-gray-900 p-3 flex flex-col justify-between'>
      <div className='flex flex-col'>
        <FaIcon type='fa-magic' title='Create New Tile' onClick={toggleTileBuilder} />
        <FaIcon type='fa-eye-dropper' title='Choose tile color' onClick={toggleColorPicker} />
      </div>
      <div className='flex flex-col'>
        <FaIcon type='fa-save' title='Save Map' onClick={() => saveObject(mapData, 'map.json')} />
        <label htmlFor={saveInputId}>
          <input className='hidden' id={saveInputId} type='file' onChange={e => onMapLoad(mapLoad, e.target.files)} />
          <FaIcon type='fa-file-upload' title='Load Map' />
        </label>
      </div>
    </div>
  )
}
