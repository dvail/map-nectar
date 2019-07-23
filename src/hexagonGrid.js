import _ from 'lodash'
import * as PIXI from 'pixi.js'
import Hexagon from './hexagon'

const axialCoord = (q, r) => [q, r].toString()

// TODO Depending on how rotation is handled this might only need x, y, and orientaion
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
}) {
  let container = new PIXI.Container()
  let radius = tileSize
  let tiles = new Map()
  let rotation = gridRotation
  let angle = viewAngle

  container.sortableChildren = true

  // TODO Add this as a public API that handles raw data, and store the render data
  // separate internally
  function getAt(q, r) {
    return tiles.get(axialCoord(q, r))
  }

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

  function addTile(q, r, height, opts) {
    let { x, y, zIndex, orientation } = getTileCoords(q, r)
    let hexagon = Hexagon.create({ q, r, x, y, zIndex, height, orientation, angle, radius, onTileClick, ...opts })
    let key = axialCoord(q, r)

    let existing = tiles.get(key)

    if (existing) {
      container.removeChild(existing.hexagon)
      existing.hexagon.destroy()
    }

    tiles.set(key, { q, r, height, opts, hexagon })

    container.addChild(hexagon)
  }

  function getTiles() {
    return tiles
  }

  function redrawTiles() {
    tiles.forEach(t => {
      addTile(t.q, t.r, t.height, t.opts)
    })
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
    getAt,
    addTile,
    getTiles,
    setRotation,
    setAngle,
    getRotation: () => rotation,
  }
}

export default {
  create,
}
