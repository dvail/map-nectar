import React, { useState, useRef, useEffect } from 'react'

import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import PixiFps from "pixi-fps";

import range from 'lodash/range'

import { useStore, tileKey } from '../store'

import ColorUtils from '../colorUtils'
import HexagonGrid from '../hexagonGrid'

// TODO Need to work with these URLs in a reliable way
const completePng = '../../res/hexagonTerrain_sheet.png'
const completeJson = '../../res/hexagonTerrain_sheet.json'

const skeletonTileOpts = { strokeColor: 0xbbbbbb, fillColor: 0x111111, strokeAlpha: 0.1, fillAlpha: 0.1 }
const gridLayoutOps = { gridX: 0, gridY: 0, tileSize: 40, viewAngle: 0.65 }

export default function RenderPane() {
  let rotation = useStore(state => state.rotation)
  let viewAngle = useStore(state => state.viewAngle)
  let shiftKey = useStore(state => state.shiftKey)
  let mapData = useStore(state => state.mapData)
  let selectedTileImage = useStore(state => state.selectedTileImage)

  let removeTile = useStore(state => state.removeTile)
  let updateTile = useStore(state => state.updateTile)
  let rotateClock = useStore(state => state.rotateClock)
  let rotateCounter = useStore(state => state.rotateCounter)
  let increaseAngle = useStore(state => state.increaseAngle)
  let decreaseAngle = useStore(state => state.decreaseAngle)

  let [pixiViewport, setPixiViewPort] = useState(null)
  let [skeletonGrid, setSkeletonGrid] = useState(null)
  let [hexGrid, setHexGrid] = useState(null)

  let [shiftDragCoords, setShiftDragCoords] = useState(null)
  let [dragging, setDragging] = useState(false)

  const renderPaneRef = useRef(null)
  const mapDataRef = useRef(mapData)
  const selectedTileImageRef = useRef(selectedTileImage)
  const draggingRef = useRef(dragging)
  const shiftKeyRef = useRef(shiftKey)
  const shiftDragCoordsRef = useRef(shiftDragCoords)

  useEffect(() => {
    initializePixi(renderPaneRef.current)
  }, [])

  // Used to update stale references passed to PIXI callbacks
  useEffect(() => {
    mapDataRef.current = mapData
    selectedTileImageRef.current = selectedTileImage
    draggingRef.current = dragging
    shiftKeyRef.current = shiftKey
    shiftDragCoordsRef.current = shiftDragCoords
  }, [mapData, selectedTileImage, dragging, shiftKey, shiftDragCoords])

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
      pixiViewport?.plugins.pause('drag')
    } else {
      pixiViewport?.plugins.resume('drag')
    }
  }, [shiftKey])

  useEffect(() => {
    hexGrid?.renderTiles(mapData.tiles)
  }, [mapData])

  function onTileClick(ev, q, r) {
  }

  function onTileRightClick(ev, q, r) {
    if (draggingRef.current) return

    let shift = ev.data.originalEvent.shiftKey
    let tile = mapDataRef.current.tiles[tileKey(q, r)]

    if (shift && !tile) return

    let altitude = tile?.altitude + (shift ? -1 : 1) || 0
    let opts = tile?.opts ?? {
      fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
    }

    opts.tileImage = selectedTileImageRef.current

    // TODO Maybe do away with trying to do delcarative rendering to the PIXI canvas
    // ans create and imperitive/declarative bridge between this and the rest of the UI
    if (altitude < 0) {
      removeTile({ q, r })
    } else {
      updateTile({ q, r, altitude, opts })
    }
  }

  function onDragStart(e) {
    let { x, y } = e.data.global

    if (!shiftDragCoordsRef.current) {
      setShiftDragCoords({ x, y })
    }
  }

  function onDragMove(e) {
    if (!shiftKeyRef.current) return
    console.warn('Can I detect event.buttons in here to avoid the dragStart/End methods?')

    let { x, y } = e.data.global

    if (!shiftDragCoordsRef.current) {
      setShiftDragCoords({ x, y })
      return
    }

    let { x: ox, y: oy } = shiftDragCoordsRef.current
    let deltaX = x - ox
    let deltaY = y - oy

    // TODO Configure these magic numbers?
    let xRotations = Math.round(deltaX / 40)
    let yRotations = Math.round(deltaY / 40)

    if (xRotations || yRotations) {
      setShiftDragCoords({ x, y })
    }

    if (xRotations < 0) {
      rotateClock()
    } else if (xRotations > 0) {
      rotateCounter()
    }

    if (yRotations < 0) {
      increaseAngle()
    } else if (yRotations > 0) {
      decreaseAngle()
    }
  }

  function onDragEnd() {
    setShiftDragCoords(null)
  }

  function initializePixi(renderPaneElem) {
    let app = new PIXI.Application({ resizeTo: renderPaneElem })
    renderPaneElem.appendChild(app.view)

    let viewport = new Viewport({ interaction: app.renderer.plugins.interaction })

    app.stage.addChild(viewport)
    app.stage.addChild(new PixiFps());

    let tileTextures = {}

    // TODO
    // TODO This relies on a race condition to get textures to the rest of the app
    // TODO Fix this to handle async loading and asset storage in a real way
    // TODO
    app.loader
      .add('tile-spritesheet', completeJson)
      .add('tile-spritesheet-png', completePng)
      .load((loader, resources) => {
        let sheet = resources['tile-spritesheet'];
        let sheetPng = resources['tile-spritesheet-png'];

        Object.entries(sheet.data).forEach(([region, { x, y, w, h }]) => {
          tileTextures[region] = new PIXI.Texture(sheetPng.texture, new PIXI.Rectangle(x, y, w, h))
        })
      })

    viewport.drag().wheel()
    viewport.on('drag-start', () => setDragging(true))
    viewport.on('drag-end', () => setDragging(false))
    viewport.moveCenter(275, 50) // TODO These are magic values...

    let baseGrid = HexagonGrid(app.renderer, { ...gridLayoutOps, onTileClick, onTileRightClick })

    let tileGrid = HexagonGrid(app.renderer, { ...gridLayoutOps, onTileClick, onTileRightClick, tileTextures })
    // TODO The performance of this probably sucks
    range(-10, 10).forEach(q => {
      range(-10, 10).forEach(r => {
        baseGrid.renderTile({ q, r, altitude: 0, opts: skeletonTileOpts })
      })
    })

    viewport.addChild(baseGrid.container)

    viewport.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove)

    viewport.addChild(tileGrid.container)

    setPixiViewPort(viewport)
    setSkeletonGrid(baseGrid)
    setHexGrid(tileGrid)
  }

  return (
    <div ref={renderPaneRef} className='relative flex-1 h-full' onContextMenu={e => e.preventDefault()} />
  )
}
