import React, { useEffect } from 'react'

import { ChromePicker } from 'react-color'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import TileBuilder from './tileBuilder'
import { useStore } from '../store'

export default function Root() {
  const getAll = useStore(state => state.getAll)
  const colorPickerOpen = useStore(state => state.colorPickerOpen)
  const selectedTileColor = useStore(state => state.selectedTileColor)
  const setSelectedTileColor = useStore(state => state.setSelectedTileColor)

  // Expose state view to console
  useEffect(() => { window.getAll = getAll }, [])

  return (
    <div
      className='h-full flex flex-row bg-black'
    >
      <Sidebar />
      <TileBuilder />
      <RenderPane />
      {colorPickerOpen && (
        <ChromePicker
          className='absolute top-0 left-0 m-20'
          color={selectedTileColor}
          onChangeComplete={setSelectedTileColor}
        />
      )}
      <Dock />
      <Compass />
    </div>
  )
}
