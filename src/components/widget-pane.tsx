import React from "react"
import { ChromePicker } from "react-color"

import { useStore, Widget } from "../store"
// import TileBuilder from "./tile-builder"
import SavedMapPane from "./saved-map-pane"
import TileSetPane from "./tile-set-pane"
import ImagePicker from "./image-picker"

export default function WidgetPane() {
  let selectedTileColor = useStore(state => state.selectedTileColor)
  let setSelectedTileColor = useStore(state => state.setSelectedTileColor)
  let openWidget = useStore(state => state.openWidget)
  let toggleWidget = useStore(state => state.toggleWidget)

  let widgetComponent =
    // (openWidget === Widget.TileBuilder)  ? <TileBuilder /> :
    (openWidget === Widget.SavedMapPane) ? <SavedMapPane /> :
    (openWidget === Widget.TileSetPane)  ? <TileSetPane /> :
    (openWidget === Widget.ImagePicker)  ? <ImagePicker /> :
    (openWidget === Widget.ColorPicker)  ? <ChromePicker color={selectedTileColor} onChangeComplete={colorResult => setSelectedTileColor(colorResult.rgb)} /> :
                                           null

  return widgetComponent && (
    <div className='absolute top-0 left-0 bg-gray-700 p-1 pb-4 pr-4 z-10 text-gray-100 flex flex-row'>
      <div
        className='w-8 cursor-pointer align-self-start text-xl text-center font-sans font-bold hover:text-pink-400'
        onClick={() => toggleWidget(null)}
        title='Close Panel'
      >
        🗙
      </div>
      <div className='pl-2 pt-8'>
        {widgetComponent}
      </div>
    </div>
  )
}
