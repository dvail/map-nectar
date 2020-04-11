import React from 'react'
import FaIcon from './faIcon'

export default function TileBuilder() {
  return (
    <div className='flex flex-row'>
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
    </div>
  )
}
