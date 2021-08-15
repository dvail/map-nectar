import * as React from 'react'
import { useState } from 'react'

import Icon from './bricks/icon'
import { useStore } from '../store'
import { getSavedMaps, loadLocal, deleteMap } from '../util/misc'
import Button, { ButtonType } from './bricks/button'

export default function SavedMapPane() {
  let mapLoad = useStore(state => state.mapLoad)
  let setOpenWidget = useStore(state => state.toggleWidget)

  let [maps, setMaps] = useState(getSavedMaps())
  let [deletePending, setDeletePending] = useState({})

  function loadById(id: string) {
    let loaded = loadLocal(id)
    mapLoad(loaded)
    setOpenWidget(null);
  }

  return (
    <ul>
      {Object.values(maps).map(map => (
        <li className='flex flex-row items-center p-1' key={map.id}>
          <span className='pr-4 flex-grow'>
            <Icon className='text-xl w-8 text-gray-200' type='far fa-map' title='View Maps' />
            <span className='pl-2'>{map.name}</span>
          </span>
          <Button type={ButtonType.Action} onClick={() => loadById(map.id)}>Load</Button>
          <Icon
            className={
              `pl-3 text-xl w-8 cursor-pointer
            ${deletePending === map.id
                ? "text-red-400 hover:text-red-600 animate-pulse"
                : "text-gray-400 hover:text-gray-200"}`
            }
            type='fa-trash'
            title='Delete Map'
            onClick={() => {
              if (deletePending === map.id) {
                deleteMap(map.id)
                setMaps(getSavedMaps)
              } else {
                setDeletePending(map.id)
              }
            }}
          />
        </li>
      ))}
    </ul>
  )
}
