import * as PIXI from 'pixi.js'
// import PixiFps from "pixi-fps";
import { Viewport } from 'pixi-viewport'

import { HexagonGrid, orientationFromDegrees } from './hexagon-grid'
import { tileKey, TileOptions, MapData, RotationInterval, TileCoords, TileData, TileMap, TileSetMap, TileSprite } from '../store'
import ColorUtils from '../util/color'
import { hexFromWorldCoords, ORIENTATION } from '../util/math'
import { TileSetTextureMap } from './hexagon'

const tileRadius = 64

const baseGridOptions = { tileRadius }

export interface StoreProperties {
  selectedTileColor: RGBColor
  removeTile(tile: TileCoords): void
  updateTile(tile: TileCoords & Partial<TileData>): void
  rotateClock(): void
  rotateCounter(): void
  increaseAngle(): void
  decreaseAngle(): void
}

enum AltitudeChange {
  UP,
  DOWN,
}

interface RGBColor {
  r: number, g: number, b: number
}

interface Point2D {
  x: number
  y: number
}

export interface MapViewType {
  setRotation(newRotation: RotationInterval): void
  setAngle(newViewAngle: number): void
  setMapData(mapData: MapData): void,
  setSelectedTileColor(color: RGBColor): void,
  setSelectedTileImage(image: TileSprite | null): void
  renderTiles(tiles: TileMap): void
  loadTileSets(tileSet: TileSetMap): void
}

export default function MapView(element: HTMLDivElement, initialMapData: MapData, store: StoreProperties): MapViewType {
  // TODO Update the handling of this to better support dynamic adding/removing of tilesets
  let tileSetTextures = { 1: {}, 2: {}, 3: {}, 4: {} } as TileSetTextureMap

  let app = new PIXI.Application({ resizeTo: element })
  let viewport = new Viewport({ interaction: app.renderer.plugins.interaction })
  let hexGrid = HexagonGrid(app.renderer, { ...baseGridOptions, onTileClick, onTileRightClick, tileTextures: tileSetTextures })

  let viewAngle = 0
  let rotation: RotationInterval = 0
  let orientation = ORIENTATION.POINTY
  let dragging = false
  let mapData = initialMapData
  let shiftDragCoords: Point2D | null = null
  let { selectedTileColor } = store
  let selectedTileImage: TileSprite | null = null

  element.appendChild(app.view)

  app.stage.addChild(viewport)
  // app.stage.addChild(new PixiFps());

  viewport.drag({ mouseButtons: 'left' }).wheel()
  viewport.on('drag-start', () => { dragging = true })
  viewport.on('drag-end', () => { dragging = false })
  viewport.moveCenter(275, 50) // TODO These are magic values...

  viewport.on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove)

  viewport.on('clicked', ({ world, event }) => {
    // Unrotate the world point based on camera rotation
    let rightClick = (event.data.originalEvent as MouseEvent).button === 2
    if (rightClick) {
      let [q, r] = hexFromWorldCoords(world.x, world.y, tileRadius, viewAngle, rotation, orientation)

      console.warn(q, r)
      adjustHexTile(q, r, AltitudeChange.UP)
    }
  })

  viewport.addChild(hexGrid.container)

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

    let ox = (shiftDragCoords as Point2D).x
    let oy = (shiftDragCoords as Point2D).y
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
    console.warn('left click [INCORRECT]', q, r)
  }

  function onTileRightClick(ev: any, q: number, r: number) {
    ev.stopPropagation()

    if (dragging) return

    let shift = ev.data.originalEvent.shiftKey
    let direction = shift ? AltitudeChange.DOWN : AltitudeChange.UP

    adjustHexTile(q, r, direction)
  }

  function adjustHexTile(q: number, r: number, direction: AltitudeChange) {
    let tile = mapData.tiles[tileKey(q, r)]

    if (direction === AltitudeChange.DOWN && !tile) return

    let altitude = tile?.altitude + (direction === AltitudeChange.DOWN ? -1 : 1) || 0
    let opts = tile?.opts ?? {} as TileOptions

    opts.fillColor = ColorUtils.fromRGB(selectedTileColor)

    opts.tileSet = selectedTileImage?.tileSet ?? opts.tileSet
    opts.tileImage = selectedTileImage?.tileImage ?? opts.tileSet

    if (altitude < 0) {
      store.removeTile({ q, r })
    } else {
      store.updateTile({ q, r, altitude, opts })
    }
  }

  function setRotation(newRotation: RotationInterval) {
    rotation = newRotation
    orientation = orientationFromDegrees(rotation)

    hexGrid?.setRotation(rotation)
  }

  function setAngle(newViewAngle: number) {
    viewAngle = newViewAngle
    hexGrid?.setAngle(viewAngle)
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
    let oldTileSetIds = tileSets
    Object.entries(oldTileSetIds).forEach(([id, tileset]) => {
      Object.entries(tileset).forEach(([name, texture]) => {
        texture.destroy()
        delete tileSetTextures[id][name]
      })
    })
  }

  function addTileSets(tileSets: TileSetMap) {
    Object.entries(tileSets).forEach(([id, tileSet]) => {
      let image = new Image()
      image.src = tileSet.image

      let baseTexture = new PIXI.BaseTexture(image);

      Object.entries(tileSet.atlas).forEach(([region, { x, y, w, h }]) => {
        tileSetTextures[id][region] = new PIXI.Texture(baseTexture, new PIXI.Rectangle(x, y, w, h))
      })
    })
  }

  function setMapData(data: MapData) {
    mapData = data
  }

  function setSelectedTileColor(color: RGBColor) {
    selectedTileColor = color
  }

  function setSelectedTileImage(image: TileSprite) {
    selectedTileImage = image
  }

  return {
    setRotation,
    setAngle,
    renderTiles,
    loadTileSets,
    setMapData,
    setSelectedTileColor,
    setSelectedTileImage,
  }
}
