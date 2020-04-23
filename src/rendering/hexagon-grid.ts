import * as PIXI from 'pixi.js'
import Hexagon, { IHexagon, TileSetTextureMap } from './hexagon'

import { tileKey, TileCoords, TileData, TileMap, RotationInterval } from '../store'
import { getTileCoords } from '../util/math'

export interface HexagonGridOptions {
  tileRadius: number
  viewAngle?: number
  gridRotation?: RotationInterval
  onTileClick?: any
  onTileRightClick?: any
  tileTextures: TileSetTextureMap
}

export interface HexagonGrid {
  container: PIXI.Container
  renderTile: ({ q, r }: TileCoords, { altitude, opts }: TileData) => void
  setRotation: (degrees: RotationInterval) => void
  setAngle: (newAngle: number) => void
  renderTiles: (newTiles: TileMap) => void
}

export function HexagonGrid(renderer: PIXI.Renderer, {
  tileRadius,
  viewAngle = 1.0,
  gridRotation = 0,
  onTileClick,
  onTileRightClick,
  tileTextures,
}: HexagonGridOptions): HexagonGrid {
  let container = new PIXI.Container()
  let radius = tileRadius
  let tiles: {
    [key: string]: TileCoords & TileData & { hexagon: IHexagon }
  } = {}
  let rotation = gridRotation
  let angle = viewAngle

  container.sortableChildren = true

  function renderTile({ q, r }: TileCoords, { altitude, opts }: TileData) {
    let key = tileKey(q, r)
    let tile = tiles[key]
    let hexagon = tile?.hexagon
    let { x, y, zIndex, orientation } = getTileCoords(q, r, rotation, angle, radius)

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
