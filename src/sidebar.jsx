import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'

import { Icon, Label, Popover } from '@blueprintjs/core'
import { IconNames } from "@blueprintjs/icons"
import { MapDataAction } from './mapDataReducer'
import { saveObject } from './fileUtils'
import AtlasRegion from './atlasRegion'

import completePng from '../res/complete.png'
import completeJson from '../res/complete.json'

let MainSidebar = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
let TouchIcon = styled(Icon)`
  cursor: pointer;
  margin: 8px 0;
`

let HiddenInput = styled.input`
  display: none;
`

let SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
`

let SidebarTop = styled(SidebarGroup)`
`

let SidebarBottom = styled(SidebarGroup)`
`

export default function Sidebar({ mapData, mapDataDispatch, onDrawModeChange }) {
  const [texturePickerOpen, setTexturePickerOpen] = useState(false)

  function onMapLoad(e) {
    let file = _.first(e.target.files)
    let reader = new FileReader()

    reader.onload = event => {
      mapDataDispatch({ type: MapDataAction.LoadMap, data: JSON.parse(event.target.result) })
    }

    reader.readAsText(file)
  }

  function onMapSave() {
    saveObject(mapData, 'map.json')
  }

  return (
    <MainSidebar>
      <SidebarTop>
        <Popover position="right">
          <TouchIcon
            htmlTitle="Use textures"
            icon={IconNames.GRID_VIEW}
            iconSize={20}
            onClick={() => setTexturePickerOpen(!texturePickerOpen)}
          />
          <AtlasRegion image={completePng} atlas={completeJson} region="tileRock.png" scale={0.5} />
        </Popover>
        <TouchIcon
          htmlTitle="Use colors"
          icon={IconNames.TINT}
          iconSize={20}
          onClick={onDrawModeChange}
        />
      </SidebarTop>
      <SidebarBottom>
        <TouchIcon htmlTitle="Save Map" icon={IconNames.IMPORT} iconSize={20} onClick={onMapSave} />
        <Label htmlFor="loadMapInput">
          <HiddenInput id="loadMapInput" type="file" accept=".json" onChange={onMapLoad} />
          <TouchIcon htmlTitle="Load Map" icon={IconNames.EXPORT} iconSize={20} />
        </Label>
      </SidebarBottom>
    </MainSidebar>
  )
}
