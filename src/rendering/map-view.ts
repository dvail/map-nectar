import * as PIXI from 'pixi.js'
// import PixiFps from "pixi-fps";
import { Viewport } from 'pixi-viewport'
import range from 'lodash/range'

import { HexagonGridOptions, HexagonGrid } from './hexagon-grid'
import { tileKey, TileOptions, MapData, RotationInterval, TileCoords, TileData, TileMap, TileSetMap, TileSprite } from '../store'
import ColorUtils from '../color-utils'
import { TileSetTextureMap } from './hexagon'

const skeletonTileOpts = { strokeColor: 0xbbbbbb, fillColor: 0x111111, strokeAlpha: 0.1, fillAlpha: 0.1 }
const baseGridOptions: HexagonGridOptions = { gridX: 0, gridY: 0, tileSize: 64, viewAngle: 0.65 }

export interface StoreActions {
  removeTile(tile: TileCoords): void
  updateTile(tile: TileCoords & Partial<TileData>): void
  rotateClock(): void
  rotateCounter(): void
  increaseAngle(): void
  decreaseAngle(): void
}

export default function MapView(store: StoreActions) {
  let app: PIXI.Application = null
  let viewport: Viewport = null
  let hexGrid: HexagonGrid = null
  let skeletonGrid: HexagonGrid = null

  let dragging = false
  let mapData: MapData = null
  let shiftDragCoords: { x: number, y: number } = null
  let selectedTileColor: { r: number, g: number, b: number } = null
  let selectedTileImage: TileSprite = null

  // TODO Update the type signature here to support multiple tile sets
  let tileSetTextures = {
    '1': {},
    '2': {},
    '3': {},
  } as TileSetTextureMap

  function initialize(element: HTMLDivElement) {
    app = new PIXI.Application({ resizeTo: element })
    element.appendChild(app.view)

    viewport = new Viewport({ interaction: app.renderer.plugins.interaction })

    app.stage.addChild(viewport)
    // app.stage.addChild(new PixiFps());

    viewport.drag().wheel()
    viewport.on('drag-start', () => { dragging = true })
    viewport.on('drag-end', () => { dragging = false })
    viewport.moveCenter(275, 50) // TODO These are magic values...

    skeletonGrid = HexagonGrid(app.renderer, { ...baseGridOptions, onTileClick, onTileRightClick })
    hexGrid = HexagonGrid(app.renderer, { ...baseGridOptions, onTileClick, onTileRightClick, tileTextures: tileSetTextures })

    range(-20, 20).forEach(q => {
      range(-20, 20).forEach(r => {
        skeletonGrid.renderTile({ q, r }, { altitude: 0, opts: skeletonTileOpts })
      })
    })

    viewport.addChild(skeletonGrid.container)

    viewport.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove)

    viewport.addChild(hexGrid.container)
  }

  function onDragStart(e: any) {
    let { x, y } = e.data.global

    if (!shiftDragCoords) {
      shiftDragCoords = { x, y }
    }
  }

  function onDragMove(e: any) {
    // TODO Re-implement
    if (true) return

    let { x, y } = e.data.global

    if (!shiftDragCoords) {
      shiftDragCoords = { x, y }
      return
    }

    let { x: ox, y: oy } = shiftDragCoords
    let deltaX = x - ox
    let deltaY = y - oy

    // TODO Configure these magic numbers?
    let xRotations = Math.round(deltaX / 40)
    let yRotations = Math.round(deltaY / 40)

    if (xRotations || yRotations) {
      shiftDragCoords = { x, y }
    }

    if (xRotations < 0) {
      store.rotateClock()
    } else if (xRotations > 0) {
      store.rotateCounter()
    }

    if (yRotations < 0) {
      store.increaseAngle()
    } else if (yRotations > 0) {
      store.decreaseAngle()
    }
  }

  function onDragEnd() {
    shiftDragCoords = null
  }

  function onTileClick(ev: any, q: number, r: number) {
    console.warn('left click', q, r)
  }

  function onTileRightClick(ev: any, q: number, r: number) {
    if (dragging) return

    let shift = ev.data.originalEvent.shiftKey
    let tile = mapData.tiles[tileKey(q, r)]

    if (shift && !tile) return

    let altitude = tile?.altitude + (shift ? -1 : 1) || 0
    let opts = tile?.opts ?? {} as TileOptions

    opts.fillColor = ColorUtils.fromRGB(selectedTileColor)

    opts.tileSet = selectedTileImage?.tileSet
    opts.tileImage = selectedTileImage?.tileImage

    if (altitude < 0) {
      store.removeTile({ q, r })
    } else {
      store.updateTile({ q, r, altitude, opts })
    }
  }

  function setRotation(rotation: RotationInterval) {
    hexGrid?.setRotation(rotation)
    skeletonGrid?.setRotation(rotation)
  }

  function setAngle(viewAngle: number) {
    hexGrid?.setAngle(viewAngle)
    skeletonGrid?.setAngle(viewAngle)
  }

  function renderTiles(tiles: TileMap) {
    hexGrid?.renderTiles(tiles)
  }

  function loadTileSets(tiles: TileSetMap) {
    // TODO Handle this in a cleaner way, currently it destroys tilesets/textures needlessly
    removeTileSets(tileSetTextures)
    addTileSets(tiles)
  }

  function removeTileSets(tileSets: TileSetTextureMap) {
    let oldTileSetIds = tileSetTextures
    for (let [id, tileset] of Object.entries(oldTileSetIds)) {
      for (let [name, texture] of Object.entries(tileset)) {
        texture.destroy()
        delete tileSetTextures[id][name]
      }
    }
  }

  function addTileSets(tileSets: TileSetMap) {
    for (let [id, tileSet] of Object.entries(tileSets)) {
      let image = new Image()
      image.src = tileSet.image

      let baseTexture = new PIXI.BaseTexture(image);

      Object.entries(tileSet.atlas).forEach(([region, { x, y, w, h }]) => {
        tileSetTextures[id][region] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, w, h))
      })
    }

    console.warn(tileSetTextures)
  }

  function setMapData(data: MapData) {
    mapData = data
  }

  function setSelectedTileColor(color: { r: number, g: number, b: number }) {
    selectedTileColor = color
  }

  function setSelectedTileImage(image: TileSprite) {
    selectedTileImage = image
  }

  return {
    initialize,
    setRotation,
    setAngle,
    renderTiles,
    loadTileSets,
    setMapData,
    setSelectedTileColor,
    setSelectedTileImage,
  }
}
