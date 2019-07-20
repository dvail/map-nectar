import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import _ from 'lodash'

import ColorUtils from './colorUtils'
import HexagonGrid from './hexagonGrid'
import sampleTileData from './sampleData'

const paneWidth = 500
const paneHeight = 500

const StyledPane = styled.div`
  width: ${paneWidth}px;
  height: ${paneHeight}px;
`

export default function RenderPane() {
  let paneElem = useRef(null)

  useEffect(() => {
    let app = new PIXI.Application()

    paneElem.current.appendChild(app.view)

    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      interaction: app.renderer.plugins.interaction,
    })

    app.stage.addChild(viewport)

    viewport.drag().wheel()
    viewport.moveCenter(275, 50) // TODO These are magic values...

    let skeletonGrid = HexagonGrid.create({ gridX: 0, gridY: 0, tileSize: 35, angle: 0.68 })

    // TODO The performance of this probably sucks
    _.range(-10, 10).forEach(q => {
      _.range(-10, 10).forEach(r => {
        skeletonGrid.addTile(q, r, 0, { strokeColor: 0xbbbbbb })
      })
    })


    let hexGrid = HexagonGrid.create({ gridX: 0, gridY: 0, tileSize: 35, angle: 0.68 })
    sampleTileData.tiles.forEach(([q, r, height]) => {
      hexGrid.addTile(q, r, height, {
        fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
      })
    })

    viewport.addChild(skeletonGrid.container)
    viewport.addChild(hexGrid.container)

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
