import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'

import { Slider } from '@blueprintjs/core'

import RenderPane from './renderPane'
import Compass from './compass'

const AppLayout = styled.div`
  display: flex;
  flex-direction: row;
`

function App() {
  const [rotation, setRotation] = useState(0)
  const [viewAngle, setViewAngle] = useState(0.65)

  return (
    <div className="bp3-dark">
      <AppLayout>
        <h1>Apis</h1>
        <RenderPane rotation={rotation} viewAngle={viewAngle} />
        <Compass rotation={rotation} onRotationChange={setRotation} />
        <Slider
          min={0}
          max={1}
          stepSize={0.05}
          labelStepSize={0.25}
          onChange={setViewAngle}
          value={viewAngle}
          vertical
        />
      </AppLayout>
    </div>
  )
}

const rootElement = document.getElementById('app')
ReactDOM.render(<App />, rootElement)

rootElement?.test

rootElement |> console.log
