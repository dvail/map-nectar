import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'

import HexagonGrid from './hexagonGrid'
import sampleTileData from './sampleData'

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

    let hexGrid = HexagonGrid.create({ gridX: 300, gridY: 200, tileSize: 35, angle: 0.68 })
    sampleTileData.tiles.forEach(tile => hexGrid.addTile(...tile))

    app.stage.addChild(hexGrid.container)

    let timer = 0;
    app.ticker.add(delta => {
      timer += delta;
      if (timer > 50) {
        hexGrid.setRotation(hexGrid.getRotation() + 30);
        timer = 0;
      }
    });
  }, [])

  return <StyledPane ref={paneElem} />
}
