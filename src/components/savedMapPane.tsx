import * as React from 'react'

import FaIcon from './faIcon'
import { useStore } from '../store'
import { getSavedMaps, loadLocal } from '../util'

export default function SavedMapPane() {
  let mapLoad = useStore(state => state.mapLoad)
  let setOpenWidget = useStore(state => state.toggleWidget)

  let savedMaps = getSavedMaps()

  function loadById(id: string) {
    let loaded = loadLocal(id)
    mapLoad(loaded)
    setOpenWidget(null);
  }

  return (
    <ul>
      {Object.values(savedMaps).map(map => (
        <li className='flex flex-row justify-between items-center p-1' key={map.id}>
          <span className='pr-4'>
            <FaIcon className='text-xl w-8 text-gray-100' type='far fa-map' title='View Maps' />
            <span className='pl-2'>{map.name}</span>
          </span>
          <button className='bg-pink-600 text-white px-4 py-1' type='button' onClick={() => loadById(map.id)}>Load</button>
        </li>
      ))}
    </ul>
  )
}
