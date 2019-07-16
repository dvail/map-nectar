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

    let pointyGrid = HexagonGrid.create({ x: 150, y: 100, tileSize: 35, orientation: Hexagon.ORIENTATION.POINTY, angle: 0.68 })
    let flatGrid = HexagonGrid.create({ x: 350, y: 300, tileSize: 35, orientation: Hexagon.ORIENTATION.FLAT, angle: 0.68 })

    // TODO This might not an efficent way to implement zIndex
    // Look into PIXI-layers plugin if performance becomes and issue, or when time
    let pointyTiles = new PIXI.Container()
    pointyTiles.sortableChildren = true

    let flatTiles = new PIXI.Container()
    flatTiles.sortableChildren = true

    app.stage.addChild(pointyTiles)
    app.stage.addChild(flatTiles)

    pointyGrid.getTiles().forEach(tile => pointyTiles.addChild(tile))
    flatGrid.getTiles().forEach(tile => flatTiles.addChild(tile))

  }, [])

  return <StyledPane ref={paneElem} />
}
