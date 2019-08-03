import _ from 'lodash'
import * as PIXI from 'pixi.js'
import Hexagon from './hexagon'

import { tileKey } from './mapDataReducer'

function getZIndex(q, r, s, orientation) {
  if (orientation === Hexagon.ORIENTATION.POINTY) {
    return r;
  } else {
    return q + r + r
  }
}

function orientationFromDegrees(degrees) {
  return (degrees / 30) % 2 === 0
    ? Hexagon.ORIENTATION.POINTY
    : Hexagon.ORIENTATION.FLAT;
}

function getAxialViewCoords(q, r, rotation) {
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

function create({
  gridX,
  gridY,
  tileSize,
  viewAngle = 1.0,
  gridRotation = 0,
  onTileClick = _.noop,
  onTileRightClick = _.noop,
}) {
  let container = new PIXI.Container()
  let radius = tileSize
  let tiles = {}
  let rotation = gridRotation
  let angle = viewAngle

  container.sortableChildren = true

  function getTileCoords(q, r) {
    const { viewQ, viewR } = getAxialViewCoords(q, r, rotation)
    const orientation = orientationFromDegrees(rotation)
    const { width, height } = Hexagon.dimensions(radius, orientation)

    let xOffset = width * (viewQ + (viewR / 2))
    let yOffset = (height * 3 / 4) * viewR * angle

    if (orientation === Hexagon.ORIENTATION.FLAT) {
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

  function renderTile({ q, r, height, opts }) {
    let key = tileKey(q, r)
    let tile = tiles[key]
    let hexagon = tile?.hexagon
    let { x, y, zIndex, orientation } = getTileCoords(q, r)

    if (!tile) {
      hexagon = Hexagon.create({ q, r, x, y, onTileClick, onTileRightClick })
      container.addChild(hexagon.graphics)
    }

    tile = { q, r, height, opts, hexagon }
    tiles[key] = tile
    tile.hexagon.draw({ x, y, zIndex, height, orientation, angle, radius, ...opts })
  }

  function renderTiles(newTiles) {
    clearDeletedTiles(newTiles)
    Object.values(newTiles).forEach(renderTile)
  }

  function clearDeletedTiles(newTiles) {
    Object.keys(tiles).forEach(key => {
      if (newTiles[key] || !tiles[key]) return

      tiles[key].hexagon.graphics.destroy()
      delete tiles[key]
    })
  }

  function redrawTiles() {
    Object.values(tiles).forEach(renderTile)
  }

  function setRotation(degrees) {
    rotation = degrees % 360
    redrawTiles()
  }

  function setAngle(newAngle) {
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

export default {
  create,
}
