import React, { useState, useReducer } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'

import { Slider, Colors } from '@blueprintjs/core'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import mapDataReducer from './mapDataReducer'
import mapViewReducer, { MapViewAction, AngleIncrement } from './mapViewReducer'

const { SetAngle } = MapViewAction

const AppLayout = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: ${Colors.DARK_GRAY1};
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

const defaultMapData = { tiles: {} }
const defaultMapView = { rotation: 0, viewAngle: 0.65 }

function App() {
  const [mapData, mapDataDispatch] = useReducer(mapDataReducer, defaultMapData)
  const [mapView, mapViewDispatch] = useReducer(mapViewReducer, defaultMapView)

  const [shiftKey, setShiftKey] = useState(false)

  function setShift(e) {
    setShiftKey(e.shiftKey)
  }

  return (
    <AppLayout className="bp3-dark" tabIndex="0" onKeyDown={setShift} onKeyUp={setShift}>
      <Sidebar mapData={mapData} mapDataDispatch={mapDataDispatch} />
      <Workspace>
        <RenderPane
          mapData={mapData}
          mapDataDispatch={mapDataDispatch}
          rotation={mapView.rotation}
          viewAngle={mapView.viewAngle}
          shiftKey={shiftKey}
          mapViewDispatch={mapViewDispatch}
        />
        <Compass rotation={mapView.rotation} mapViewDispatch={mapViewDispatch} />
        <ViewSlider
          min={0}
          max={1}
          stepSize={AngleIncrement}
          labelStepSize={0.25}
          onChange={v => mapViewDispatch({ type: SetAngle, data: v })}
          value={mapView.viewAngle}
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
