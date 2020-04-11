import noop from 'lodash/noop'
import * as PIXI from 'pixi.js'
import Hexagon, { TextureMap, IHexagon, ORIENTATION, dimensions } from './hexagon'

import { tileKey } from './store'
import { TileData, TileCoords, TileMap } from './components/renderPane';

function getZIndex(q: number, r: number, s: number, orientation: ORIENTATION) {
  if (orientation === ORIENTATION.POINTY) {
    return r;
  } else {
    return q + r + r
  }
}

function orientationFromDegrees(degrees: number) {
  return (degrees / 30) % 2 === 0
    ? ORIENTATION.POINTY
    : ORIENTATION.FLAT;
}

interface ViewCoordinate {
  viewQ: number
  viewR: number
}

type RotationInterval = 0 | 30 | 60 | 90 | 120 | 150 | 180 | 210 | 240 | 270 | 300 | 330

function getAxialViewCoords(q: number, r: number, rotation: RotationInterval): ViewCoordinate {
  const s = -q - r

  return {
    0: { viewQ: q, viewR: r },
    30: { viewQ: q, viewR: r },
    60: { viewQ: -r, viewR: -s },
    90: { viewQ: -r, viewR: -s },
    120: { viewQ: s, viewR: q },
    150: { viewQ: s, viewR: q },
    180: { viewQ: -q, viewR: -r },
    210: { viewQ: -q, viewR: -r },
    240: { viewQ: r, viewR: s },
    270: { viewQ: r, viewR: s },
    300: { viewQ: -s, viewR: -q },
    330: { viewQ: -s, viewR: -q },
  }[rotation]
}

export interface HexagonGridOptions {
  gridX: number
  gridY: number
  tileSize: number
  viewAngle?: number
  gridRotation?: RotationInterval
  onTileClick?: any
  onTileRightClick?: any
  tileTextures?: TextureMap
}

export function HexagonGrid(renderer: PIXI.Renderer, {
  gridX,
  gridY,
  tileSize,
  viewAngle = 1.0,
  gridRotation = 0,
  onTileClick = noop,
  onTileRightClick = noop,
  tileTextures = {},
}: HexagonGridOptions) {
  let container = new PIXI.Container()
  let radius = tileSize
  let tiles: {
    [key: string]: TileCoords & TileData & { hexagon: IHexagon }
  } = {}
  let rotation = gridRotation
  let angle = viewAngle

  container.sortableChildren = true

  function getTileCoords(q: number, r: number) {
    const { viewQ, viewR } = getAxialViewCoords(q, r, rotation)
    const orientation = orientationFromDegrees(rotation)
    const { width, height } = dimensions(radius, orientation)

    let xOffset = width * (viewQ + (viewR / 2))
    let yOffset = (height * 3 / 4) * viewR * angle

    if (orientation === ORIENTATION.FLAT) {
      xOffset = width * viewQ * (3 / 4)
      yOffset = height * (viewR + (viewQ / 2)) * angle
    }

    return {
      x: gridX + xOffset,
      y: gridY + yOffset,
      zIndex: getZIndex(viewQ, viewR, 0 - viewQ - viewR, orientation),
      orientation,
    }
  }

  function renderTile({ q, r }: TileCoords, { altitude, opts }: TileData) {
    let key = tileKey(q, r)
    let tile = tiles[key]
    let hexagon = tile?.hexagon
    let { x, y, zIndex, orientation } = getTileCoords(q, r)

    if (!tile) {
      hexagon = Hexagon(renderer, { container, q, r, onTileClick, onTileRightClick })
    }

    tile = { q, r, altitude, opts, hexagon }
    tiles[key] = tile

    tile.hexagon.draw({ x, y, zIndex, altitude, orientation, angle, radius, tileTextures, ...opts })
  }

  function clearDeletedTiles(newTiles: TileMap) {
    Object.keys(tiles).forEach(key => {
      if (newTiles[key] || !tiles[key]) return

      tiles[key].hexagon.destroy()
      delete tiles[key]
    })
  }

  function renderTiles(newTiles: TileMap) {
    clearDeletedTiles(newTiles)
    Object.values(newTiles).forEach(tile => {
      renderTile(tile, tile)
    })
  }

  function redrawTiles() {
    Object.values(tiles).forEach(tile => {
      renderTile(tile, tile)
    })
  }

  function setRotation(degrees: RotationInterval) {
    rotation = (degrees % 360) as RotationInterval
    redrawTiles()
  }

  function setAngle(newAngle: number) {
    angle = newAngle
    redrawTiles()
  }

  return {
    container,
    renderTile,
    setRotation,
    setAngle,
    renderTiles,
  }
}
