import React from 'react'
import { useStore } from '../store'

export default function MapName() {
  let mapName = useStore(state => state.mapData.name)
  let setMapName = useStore(state => state.setMapName)

  return (
    <div className='absolute font-sans top-0 left-0 right-0 max-w-lg m-auto text-center text-white pt-2'>
      <input
        className='border-0 text-center py-1 rounded bg-gray-700 hover:bg-gray-800'
        type='text'
        title="Map Name"
        value={mapName}
        onChange={e => setMapName(e.target.value)}
      />
    </div>
  )
}
