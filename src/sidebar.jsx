import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

import { Icon, Label } from '@blueprintjs/core'
import { IconNames } from "@blueprintjs/icons";
import { MapDataAction } from './mapDataReducer'
import { saveObject } from './fileUtils';

let MainSidebar = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
`
let TouchIcon = styled(Icon)`
  cursor: pointer;
  margin: 8px 0;
`

let HiddenInput = styled.input`
  display: none;
`
export default function Sidebar({ mapData, mapDataDispatch }) {
  function onMapLoad(e) {
    let file = _.first(e.target.files)
    let reader = new FileReader()

    reader.onload = event => {
      mapDataDispatch({ type: MapDataAction.LoadMap, data: JSON.parse(event.target.result) })
    }

    reader.readAsText(file)
  }

  function onMapSave() {
    saveObject(mapData, 'map.json');
  }

  return (
    <MainSidebar>
      <TouchIcon htmlTitle="Save Map" icon={IconNames.IMPORT} iconSize={20} onClick={onMapSave} />
      <Label htmlFor="loadMapInput">
        <HiddenInput id="loadMapInput" type="file" accept=".json" onChange={onMapLoad} />
        <TouchIcon htmlTitle="Load Map" icon={IconNames.EXPORT} iconSize={20} />
      </Label>
    </MainSidebar>
  )
}
