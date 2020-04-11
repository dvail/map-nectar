import * as React from 'react'

import { GetState } from 'zustand'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import MapName from './mapName'
import { Store, useStore } from '../store'
import WidgetPane from './widgetPane'

declare global {
  interface Window {
    getAll: GetState<Store>
  }
}

let { useEffect } = React

export default function Root() {
  let getAll = useStore(state => state.getAll)

  // Expose state view to console
  useEffect(() => { window.getAll = getAll }, [])

  return (
    <div className='h-full flex flex-row bg-black'>
      <Sidebar />
      <div className='h-full w-full flex flex-col relative'>
        <WidgetPane />
        <RenderPane />
        <MapName />
        <Dock />
        <Compass className='m-2' />
      </div>
    </div>
  )
}
