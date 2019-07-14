import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'

import Hexagon from './hexagon'
import HexagonGrid from './hexagonGrid'

const StyledPane = styled.div`
  border: 1px solid black;
  min-width: 500px;
  min-height: 500px;
`

export default function RenderPane() {
  let paneElem = useRef(null)

  useEffect(() => {
    let app = new PIXI.Application()

    paneElem.current.appendChild(app.view)

    let pointyGrid = HexagonGrid.create({ x: 200, y: 200, tileSize: 50, orientation: Hexagon.ORIENTATION.POINTY, angle: 0.68 })
    let flatGrid = HexagonGrid.create({ x: 400, y: 400, tileSize: 50, orientation: Hexagon.ORIENTATION.FLAT })

    pointyGrid.getTiles().forEach(tile => app.stage.addChild(tile))
    flatGrid.getTiles().forEach(tile => app.stage.addChild(tile))
  }, [])

  return <StyledPane ref={paneElem} />
}
