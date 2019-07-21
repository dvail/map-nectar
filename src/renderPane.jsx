import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import _ from 'lodash'

import ColorUtils from './colorUtils'
import HexagonGrid from './hexagonGrid'
import sampleTileData from './sampleData'

// PIXI default canvas sizes
const paneWidth = 800
const paneHeight = 600

const StyledPane = styled.div`
  width: ${paneWidth}px;
  height: ${paneHeight}px;
`

export default function RenderPane({ rotation }) {
  let paneElem = useRef(null)

  let [app, setApp] = useState(null)
  let [viewport, setViewport] = useState(null)
  let [skeletonGrid, setSkeletonGrid] = useState(null)
  let [hexGrid, setHexGrid] = useState(null)

  useEffect(() => {
    setApp(new PIXI.Application())
  }, [])

  useEffect(() => {
    if (!app) return
    paneElem.current.appendChild(app.view)

    setViewport(new Viewport({ interaction: app.renderer.plugins.interaction }))
    setSkeletonGrid(HexagonGrid.create({ gridX: 0, gridY: 0, tileSize: 35, angle: 0.68 }))
    setHexGrid(HexagonGrid.create({ gridX: 0, gridY: 0, tileSize: 35, angle: 0.68 }))
  }, [app])

  useEffect(() => {
    if (!viewport) return

    console.warn(app)
    app.stage.addChild(viewport)

    viewport.drag().wheel()
    viewport.moveCenter(275, 50) // TODO These are magic values...
  }, [viewport])

  useEffect(() => {
    if (!skeletonGrid) return
    // TODO The performance of this probably sucks
    _.range(-10, 10).forEach(q => {
      _.range(-10, 10).forEach(r => {
        skeletonGrid.addTile(q, r, 0, { strokeColor: 0xbbbbbb })
      })
    })

    viewport.addChild(skeletonGrid.container)
  }, [skeletonGrid])

  useEffect(() => {
    if (!hexGrid) return

    sampleTileData.tiles.forEach(([q, r, height]) => {
      hexGrid.addTile(q, r, height, {
        fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
      })
    })

    viewport.addChild(hexGrid.container)
  }, [hexGrid])

  useEffect(() => {
    hexGrid?.setRotation(rotation)
    skeletonGrid?.setRotation(rotation)
  }, [rotation])

  return <StyledPane ref={paneElem} />
}
