import React from 'react'
import { useStore } from '../store'

export default function MapName() {
  let mapName = useStore(state => state.mapData.name)
  let setMapName = useStore(state => state.setMapName)

  return (
    <div className='absolute font-mono top-0 left-0 right-0 max-w-lg m-auto text-center text-white pt-4'>
      <input
        className='border-none bg-transparent text-center hover:bg-gray-900'
        type='text'
        title="Map Name"
        value={mapName}
        onChange={e => setMapName(e.target.value)}
      />
    </div>
  )
}
