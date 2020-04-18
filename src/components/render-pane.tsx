import React, { useState, useRef, useEffect } from 'react'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
// import PixiFps from "pixi-fps";
import range from 'lodash/range'

import { useStore, tileKey, TileOptions, TileSet, TileSetMap } from '../store'
import ColorUtils from '../color-utils'
import { HexagonGrid, HexagonGridOptions } from '../hexagon-grid'
import { TileSetTextureMap } from '../hexagon'

const skeletonTileOpts = { strokeColor: 0xbbbbbb, fillColor: 0x111111, strokeAlpha: 0.1, fillAlpha: 0.1 }
const baseGridOptions: HexagonGridOptions = { gridX: 0, gridY: 0, tileSize: 64, viewAngle: 0.65 }

export default function RenderPane() {
  let rotation = useStore(state => state.rotation)
  let viewAngle = useStore(state => state.viewAngle)
  let mapData = useStore(state => state.mapData)
  let selectedTileImage = useStore(state => state.selectedTileSprite)
  let selectedTileColor = useStore(state => state.selectedTileColor)

  let removeTile = useStore(state => state.removeTile)
  let updateTile = useStore(state => state.updateTile)
  let rotateClock = useStore(state => state.rotateClock)
  let rotateCounter = useStore(state => state.rotateCounter)
  let increaseAngle = useStore(state => state.increaseAngle)
  let decreaseAngle = useStore(state => state.decreaseAngle)

  let setPixiViewPort = useState(null)[1]
  let [skeletonGrid, setSkeletonGrid] = useState(null)
  let [hexGrid, setHexGrid] = useState(null)

  let [shiftDragCoords, setShiftDragCoords] = useState(null)
  let [dragging, setDragging] = useState(false)

  const renderPaneRef = useRef(null)
  const mapDataRef = useRef(mapData)
  const selectedTileImageRef = useRef(selectedTileImage)
  const selectedTileColorRef = useRef(selectedTileColor)
  const draggingRef = useRef(dragging)
  const shiftDragCoordsRef = useRef(shiftDragCoords)

  // TODO Update the type signature here to support multiple tile sets
  let tileSetTexturesRef = useRef({
    '1': {},
    '2': {},
    '3': {},
  } as TileSetTextureMap)

  useEffect(() => {
    initializePixi(renderPaneRef.current)
  }, [])

  // Used to update stale references passed to PIXI callbacks
  useEffect(() => {
    mapDataRef.current = mapData
    selectedTileImageRef.current = selectedTileImage
    selectedTileColorRef.current = selectedTileColor
    draggingRef.current = dragging
    shiftDragCoordsRef.current = shiftDragCoords
  }, [mapData, selectedTileImage, dragging, shiftDragCoords])

  useEffect(() => {
    hexGrid?.setRotation(rotation)
    skeletonGrid?.setRotation(rotation)
  }, [rotation])

  useEffect(() => {
    hexGrid?.setAngle(viewAngle)
    skeletonGrid?.setAngle(viewAngle)
  }, [viewAngle])

  /*
  useEffect(() => {
    if (shiftKey) {
      pixiViewport?.plugins.pause('drag')
    } else {
      pixiViewport?.plugins.resume('drag')
    }
  }, [shiftKey])
  */

  // NOTE: It is important that this `useEffect` runs first, so that the underlying
  // tilsets and textures are correct before rendering tiles from the mapData
  useEffect(() => {
    // TODO Handle this in a cleaner way, currently it destroys tilesets/textures needlessly
    removeTileSets(tileSetTexturesRef.current)
    addTileSets(mapData.tileSets)
  }, [mapData.tileSets])

  useEffect(() => {
    hexGrid?.renderTiles(mapData.tiles)
  }, [mapData])

  function addTileSets(tileSets: TileSetMap) {
    for (let [id, tileSet] of Object.entries(tileSets)) {
      let image = new Image()
      image.src = tileSet.image

      let baseTexture = new PIXI.BaseTexture(image);

      Object.entries(tileSet.atlas).forEach(([region, { x, y, w, h }]) => {
        tileSetTexturesRef.current[id][region] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, w, h))
      })
    }

    console.warn(tileSetTexturesRef)
  }

  function removeTileSets(tileSets: TileSetTextureMap) {
    let oldTileSetIds = tileSetTexturesRef.current
    for (let [id, tileset] of Object.entries(oldTileSetIds)) {
      for (let [name, texture] of Object.entries(tileset)) {
        texture.destroy()
        delete tileSetTexturesRef.current[id][name]
      }
    }
  }

  function onTileClick(ev: any, q: number, r: number) {
    console.warn('left click', q, r)
  }

  function onTileRightClick(ev: any, q: number, r: number) {
    if (draggingRef.current) return

    let shift = ev.data.originalEvent.shiftKey
    let tile = mapDataRef.current.tiles[tileKey(q, r)]

    if (shift && !tile) return

    let altitude = tile?.altitude + (shift ? -1 : 1) || 0
    let opts = tile?.opts ?? {} as TileOptions

    opts.fillColor = ColorUtils.fromRGB(selectedTileColorRef.current)

    opts.tileSet = selectedTileImageRef.current?.tileSet
    opts.tileImage = selectedTileImageRef.current?.tileImage

    // TODO Maybe do away with trying to do declarative rendering to the PIXI canvas
    // ans create and imperitive/declarative bridge between this and the rest of the UI
    if (altitude < 0) {
      removeTile({ q, r })
    } else {
      updateTile({ q, r, altitude, opts })
    }
  }

  function onDragStart(e: any) {
    let { x, y } = e.data.global

    if (!shiftDragCoordsRef.current) {
      setShiftDragCoords({ x, y })
    }
  }

  function onDragMove(e: any) {
    // TODO Re-implement
    if (true) return

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

  function initializePixi(renderPaneElem: HTMLElement) {
    let app = new PIXI.Application({ resizeTo: renderPaneElem })
    renderPaneElem.appendChild(app.view)

    let viewport = new Viewport({ interaction: app.renderer.plugins.interaction })

    app.stage.addChild(viewport)
    // app.stage.addChild(new PixiFps());

    viewport.drag().wheel()
    viewport.on('drag-start', () => setDragging(true))
    viewport.on('drag-end', () => setDragging(false))
    viewport.moveCenter(275, 50) // TODO These are magic values...

    let baseGrid = HexagonGrid(app.renderer, { ...baseGridOptions, onTileClick, onTileRightClick })
    let tileGrid = HexagonGrid(app.renderer, { ...baseGridOptions, onTileClick, onTileRightClick, tileTextures: tileSetTexturesRef.current })

    range(-20, 20).forEach(q => {
      range(-20, 20).forEach(r => {
        baseGrid.renderTile({ q, r }, { altitude: 0, opts: skeletonTileOpts })
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
