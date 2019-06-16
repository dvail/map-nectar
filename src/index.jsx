import React from 'react'
import ReactDOM from 'react-dom'

import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'

function App() {
  return (
    <div className="bp3-dark">
      <h1>Test23</h1>
    </div>
  )
}

const rootElement = document.getElementById('app')
ReactDOM.render(<App />, rootElement)

rootElement?.test

rootElement |> console.log
