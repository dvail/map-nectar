import * as React from 'react'

import { GetState } from 'zustand'
import { ChromePicker } from 'react-color'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import SavedMapPane from './savedMapPane'
import MapName from './mapName'
import TileBuilder from './tileBuilder'
import { Store, useStore } from '../store'

declare global {
  interface Window {
    getAll: GetState<Store>
  }
}

let { useEffect } = React

export default function Root() {
  let getAll = useStore(state => state.getAll)
  let tileBuilderOpen = useStore(state => state.tileBuilderOpen)
  let colorPickerOpen = useStore(state => state.colorPickerOpen)
  let savedMapPaneOpen = useStore(state => state.savedMapPaneOpen)

  let selectedTileColor = useStore(state => state.selectedTileColor)
  let setSelectedTileColor = useStore(state => state.setSelectedTileColor)

  // Expose state view to console
  useEffect(() => { window.getAll = getAll }, [])

  return (
    <div className='h-full flex flex-row bg-black'>
      <Sidebar />
      <div className='absolute top-0 left-0 ml-48 mt-10 z-10'>
        {/* TODO Abstract this out to ensure only one widget is open at a time */}
        {tileBuilderOpen && <TileBuilder />}
        {savedMapPaneOpen && <SavedMapPane />}
        {colorPickerOpen && (
          <ChromePicker
            color={selectedTileColor}
            onChangeComplete={setSelectedTileColor}
          />
        )}
      </div>
      <div className='h-full w-full flex flex-col relative'>
        <RenderPane />
        <MapName />
        <Dock />
        <Compass className='m-2' />
      </div>
    </div>
  )
}
