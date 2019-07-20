import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'

import RenderPane from './renderPane'
import Compass from './compass'

const AppLayout = styled.div`
  display: flex;
  flex-direction: row;
`

function App() {
  return (
    <div className="bp3-dark">
      <AppLayout>
        <h1>Apis</h1>
        <RenderPane />
        <Compass />
      </AppLayout>
    </div>
  )
}

const rootElement = document.getElementById('app')
ReactDOM.render(<App />, rootElement)

rootElement?.test

rootElement |> console.log
