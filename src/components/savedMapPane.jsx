import React from 'react'

import FaIcon from './faIcon'
import { useStore } from '../store'
import { getSavedMaps, loadLocal } from '../util'

export default function SavedMapPane() {
  let mapLoad = useStore(state => state.mapLoad)
  let toggleSavedMapPane = useStore(state => state.toggleSavedMapPane)

  let savedMaps = getSavedMaps()

  function loadById(id) {
    let loaded = loadLocal(id)
    mapLoad(loaded)
    toggleSavedMapPane();
  }

  return (
    <div className='bg-gray-800 text-gray-100 flex flex-row items-center'>
      <div
        className='h-full w-8 cursor-pointer text-xl text-center font-mono font-bold hover:text-pink-400'
        onClick={toggleSavedMapPane}
        title='Close Panel'
      >
        ⮜
      </div>
      <ul className='p-1'>
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
    </div>
  )
}
