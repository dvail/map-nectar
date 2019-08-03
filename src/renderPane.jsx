import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import _ from 'lodash'

import usePrevious from './usePrevious'
import useEffectWhenValue from './useEffectWhenValue'
import ColorUtils from './colorUtils'
import HexagonGrid from './hexagonGrid'
import { MapDataAction } from './mapDataReducer'
import { MapViewAction } from './mapViewReducer'

const { UpdateTile } = MapDataAction
const { RotateClock, RotateCounter, IncreaseAngle, DecreaseAngle } = MapViewAction

const StyledPane = styled.div`
  width: 100%;
  height: 100%;
`
const skeletonTileOpts = { strokeColor: 0xbbbbbb, fillColor: 0x010101, strokeAlpha: 0.1, fillAlpha: 0.1 }
const gridLayoutOps = { gridX: 0, gridY: 0, tileSize: 35, viewAngle: 0.68 }

export default function RenderPane({ rotation, viewAngle, mapData, mapDataDispatch, shiftKey, mapViewDispatch }) {
  let paneElem = useRef(null)

  let [app, setApp] = useState(null)
  let [viewport, setViewport] = useState(null)
  let [dragging, setDragging] = useState(false)
  let [skeletonGrid, setSkeletonGrid] = useState(null)
  let [hexGrid, setHexGrid] = useState(null)

  let hexGridRef = useRef(hexGrid)
  let dragRef = useRef(dragging)
  let shiftRef = useRef(shiftKey)
  let shiftDragCoords = useRef(null)

  let prevMapData = usePrevious(mapData)

  function onTileClick(q, r) {
    if (dragRef.current) return

    let { current } = hexGridRef;
    let tile = current.getAt(q, r)
    let height = tile?.height + 1 || 0
    let opts = tile ?.opts || {
      fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
    }

    mapDataDispatch({ type: UpdateTile, data: { q, r, height, opts } })
  }

  function onDragStart(e) {
    let { x, y } = e.data.global

    if (!shiftDragCoords.current) {
      shiftDragCoords.current = { x, y }
    }
  }

  function onDragMove(e) {
    if (!shiftRef.current) return

    let { x, y } = e.data.global

    if (!shiftDragCoords.current) {
      shiftDragCoords.current = { x, y }
    }

    let deltaX = x - shiftDragCoords.current.x
    let deltaY = y - shiftDragCoords.current.y

    // TODO Configure these magic numbers?
    let xRotations = Math.round(deltaX / 40)
    let yRotations = Math.round(deltaY / 40)

    if (xRotations || yRotations) {
      shiftDragCoords.current.x = x
      shiftDragCoords.current.y = y
    }

    if (xRotations !== 0) {
      let direction = xRotations < 0 ? RotateClock : RotateCounter
      mapViewDispatch({ type: direction })
    }

    if (yRotations !== 0) {
      let direction = yRotations < 0 ? IncreaseAngle : DecreaseAngle
      mapViewDispatch({ type: direction })
    }
  }

  function onDragEnd() {
    shiftDragCoords.current = null
  }

  // Used to get around stale closure references in callbacks based to children
  useEffect(() => {
    hexGridRef.current = hexGrid
    dragRef.current = dragging
    shiftRef.current = shiftKey
  });

  useEffect(() => {
    setApp(new PIXI.Application({ resizeTo: paneElem.current }))
  }, [])

  useEffect(() => {
    hexGrid?.renderTileChange(prevMapData?.tiles, mapData.tiles)
  }, [mapData.tiles])

  useEffect(() => {
    hexGrid?.setRotation(rotation)
    skeletonGrid?.setRotation(rotation)
  }, [rotation])

  useEffect(() => {
    hexGrid?.setAngle(viewAngle)
    skeletonGrid?.setAngle(viewAngle)
  }, [viewAngle])

  useEffect(() => {
    if (shiftKey) {
      viewport?.plugins.pause('drag')
    } else {
      viewport?.plugins.resume('drag')
    }
  }, [shiftKey])

  useEffectWhenValue(() => {
    paneElem.current.appendChild(app.view)

    setViewport(new Viewport({ interaction: app.renderer.plugins.interaction }))
    setSkeletonGrid(HexagonGrid.create({ ...gridLayoutOps, onTileClick }))
    setHexGrid(HexagonGrid.create({ ...gridLayoutOps, onTileClick }))
  }, [app])

  useEffectWhenValue(() => {
    app.stage.addChild(viewport)

    viewport.drag().wheel()
    viewport.on('drag-start', () => setDragging(true))
    viewport.on('drag-end', () => setDragging(false))
    viewport.moveCenter(275, 50) // TODO These are magic values...
  }, [viewport])

  useEffectWhenValue(() => {
    // TODO The performance of this probably sucks
    _.range(-15, 15).forEach(q => {
      _.range(-15, 15).forEach(r => {
        skeletonGrid.renderTile({ q, r, height: 0, opts: skeletonTileOpts })
      })
    })

    viewport.addChild(skeletonGrid.container)

    viewport.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove)
  }, [skeletonGrid])

  useEffectWhenValue(() => {
    viewport.addChild(hexGrid.container)
  }, [hexGrid])

  return <StyledPane ref={paneElem} />
}
