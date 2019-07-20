import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'
import _ from 'lodash'

import ColorUtils from './colorUtils'
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

    let skeletonGrid = HexagonGrid.create({ gridX: 300, gridY: 200, tileSize: 35, angle: 0.68 })

    // TODO The performance of this probably sucks
    _.range(-20, 20).forEach(q => {
      _.range(-20, 20).forEach(r => {
        skeletonGrid.addTile(q, r, 0, { strokeColor: 0xbbbbbb })
      })
    })


    let hexGrid = HexagonGrid.create({ gridX: 300, gridY: 200, tileSize: 35, angle: 0.68 })
    sampleTileData.tiles.forEach(([q, r, height]) => {
      hexGrid.addTile(q, r, height, {
        fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
      })
    })

    app.stage.addChild(skeletonGrid.container)
    app.stage.addChild(hexGrid.container)

    let timer = 0;
    app.ticker.add(delta => {
      timer += delta;
      if (timer > 120) {
        skeletonGrid.setRotation(hexGrid.getRotation() + 30);
        hexGrid.setRotation(hexGrid.getRotation() + 30);
        timer = 0;
      }
    });
  }, [])

  return <StyledPane ref={paneElem} />
}
