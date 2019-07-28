import React, { useState, useReducer } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'

import { Slider, Colors, Icon, Label } from '@blueprintjs/core'
import { IconNames } from "@blueprintjs/icons";

import RenderPane from './renderPane'
import Compass from './compass'
import mapDataReducer from './mapDataReducer'

const AppLayout = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: ${Colors.DARK_GRAY1};
`

let Sidebar = styled.div`
  padding: 8px;
  display: flex;
  flex-direction: column;
`

let Workspace = styled.div`
  position: relative;
  flex: 1;
`

let ViewSlider = styled(Slider)`
  position: absolute;
  bottom: 20px;
  right: 20px;
`

let TouchIcon = styled(Icon)`
  cursor: pointer;
  margin: 8px 0;
`

let HiddenInput = styled.input`
  display: none;
`

function App() {
  const [mapData, mapDataDispatch] = useReducer(mapDataReducer, { tiles: {} });
  const [rotation, setRotation] = useState(0)
  const [viewAngle, setViewAngle] = useState(0.65)

  function onMapLoad(e) {
    let file = _.first(e.target.files)
    let reader = new FileReader()

    reader.onload = event => console.log(event.target.result)
    reader.readAsText(file)
  }

  return (
    <AppLayout className="bp3-dark">
      <Sidebar>
        <TouchIcon htmlTitle="Save Map" icon={IconNames.IMPORT} iconSize={20} />
        <Label htmlFor="loadMapInput">
          <HiddenInput id="loadMapInput" type="file" accept=".json" onChange={onMapLoad} />
          <TouchIcon htmlTitle="Load Map" icon={IconNames.EXPORT} iconSize={20} />
        </Label>
      </Sidebar>
      <Workspace>
        <RenderPane mapData={mapData} mapDataDispatch={mapDataDispatch} rotation={rotation} viewAngle={viewAngle} />
        <Compass rotation={rotation} onRotationChange={setRotation} />
        <ViewSlider
          min={0}
          max={1}
          stepSize={0.05}
          labelStepSize={0.25}
          onChange={setViewAngle}
          value={viewAngle}
          vertical
        />
      </Workspace>
    </AppLayout>
  )
}

const rootElement = document.getElementById('app')
ReactDOM.render(<App />, rootElement)

rootElement?.test

rootElement |> console.log
