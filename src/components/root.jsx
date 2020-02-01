import React from 'react'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import TileBuilder from './tileBuilder'
import { useStore } from '../store'

export default function Root() {
  const setShift = useStore(state => state.setShift)

  return (
    <div
      className='h-full flex flex-row bg-black'
      tabIndex={0}
      onKeyDown={setShift}
      onKeyUp={setShift}
    >
      <Sidebar />
      <TileBuilder />
      <RenderPane />
      <Dock />
      <Compass />
    </div>
  )
}