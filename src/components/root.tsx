import * as React from 'react'

import { GetState } from 'zustand'

import RenderPane from './render-pane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import MapName from './map-name'
import { Store, useStore } from '../store'
import WidgetPane from './widget-pane'

declare global {
  interface Window {
    getAll: GetState<Store>
  }
}

let { useEffect } = React

export default function Root() {
  let getAll = useStore(state => state.getAll)
  let setShiftKey = useStore(state => state.setShiftKey)

  // Expose state view to console
  useEffect(() => { window.getAll = getAll }, [])

  return (
    <div className='h-full flex flex-row bg-black' onMouseMove={e => setShiftKey(e.shiftKey)}>
      <Sidebar />
      <div className='h-full flex flex-col flex-1 relative'>
        <WidgetPane />
        <RenderPane />
        <MapName />
        <Dock />
        <Compass className='m-2' />
      </div>
    </div>
  )
}
