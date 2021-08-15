import * as React from 'react'

import { GetState } from 'zustand'

import RenderPane from './render-pane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import MapName from './map-name'
import HelpPanel from './help-panel'
import WidgetPane from './widget-pane'
import { Store, useStore } from '../store'
import { getCurrentMap, loadLocal } from '../util/misc'

declare global {
  interface Window {
    getAll: GetState<Store>
  }
}

let { useEffect } = React

export default function Root() {
  let mapLoad = useStore(state => state.mapLoad)
  let getAll = useStore(state => state.getAll)
  let setShiftKey = useStore(state => state.setShiftKey)

  useEffect(() => {
    // Expose state view to console
    window.getAll = getAll

    // Auto-load the most recent map, if available
    let currentMap = getCurrentMap()
    if (currentMap) {
      mapLoad(loadLocal(currentMap))
    }
  }, [])

  return (
    <div className='h-full flex flex-row bg-black' onMouseMove={e => setShiftKey(e.shiftKey)}>
      <Sidebar />
      <div className='h-full flex flex-col flex-1 relative'>
        <WidgetPane />
        <RenderPane />
        <MapName />
        <Dock />
        <HelpPanel />
        <Compass className='m-2' />
      </div>
    </div>
  )
}
