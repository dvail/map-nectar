import React from 'react'
import FaIcon from './faIcon'
import { useStore } from '../store'

export default function TileBuilder() {
  let setTileBuilderOpen = useStore(state => state.setTileBuilderOpen)

  return (
    <div className='p-2 bg-gray-900 flex flex-row'>
      <div className='flex flex-col p-4 items-center'>
        <div className='p-2'>
          <div className='rounded-full bg-gray-100 h-20 w-20' />
        </div>
        <div className='p-2'>
          <div className='bg-gray-100 h-8 w-12' />
        </div>
        <div>
          <FaIcon type='fa-table' onClick={() => console.warn('open tile props table')} />
        </div>
      </div>
      <div className='absolute top-0 left-0 m-2'>
        <FaIcon type='fa-arrow-circle-left' onClick={() => setTileBuilderOpen(false)} />
      </div>
    </div>
  )
}
