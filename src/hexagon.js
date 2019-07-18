import * as PIXI from 'pixi.js'

import _ from 'lodash'

const ORIENTATION = {
  POINTY: 'POINTY',
  FLAT: 'FLAT',
}

function dimensions(radius, orientation) {
  let width = Math.sqrt(3) * radius
  let height = radius * 2

  if (orientation === ORIENTATION.FLAT) {
    [width, height] = [height, width]
  }

  return { radius, width, height }
}

const defaultAltitude = 20

// All of these coordinates will be relative to the actual hexagon positioning
const COORDS = {}

COORDS.POINTY = _.memoize(({ radius, angle }) => {
  const { width } = dimensions(radius, ORIENTATION.POINTY)

  const TILE_FACE = [
    -width / 2, (radius / 2) * angle,
    -width / 2, (-radius / 2) * angle,
    0, (-radius) * angle,
    width / 2, (-radius / 2) * angle,
    width / 2, (radius / 2) * angle,
    0, (radius) * angle,
  ]

  const pointyCoords = {}

  pointyCoords.TILE_FACE = TILE_FACE
  pointyCoords.LEFT_VERT = [
    TILE_FACE[0], TILE_FACE[1],
    TILE_FACE[0], TILE_FACE[1] + defaultAltitude,
    TILE_FACE[10], TILE_FACE[11] + defaultAltitude,
    TILE_FACE[10], TILE_FACE[11],
  ]
  pointyCoords.RIGHT_VERT = [
    TILE_FACE[10], TILE_FACE[11],
    TILE_FACE[10], TILE_FACE[11] + defaultAltitude,
    TILE_FACE[8], TILE_FACE[9] + defaultAltitude,
    TILE_FACE[8], TILE_FACE[9],
  ]
  return pointyCoords
})

COORDS.FLAT = _.memoize(({ radius, angle }) => {
  const { width } = dimensions(radius, ORIENTATION.POINTY)

  const TILE_FACE = [
    -radius, 0 * angle,
    -radius / 2, (width / 2) * angle,
    radius / 2, (width / 2) * angle,
    radius, 0 * angle,
    radius / 2, (-width / 2) * angle,
    -radius / 2, (-width / 2) * angle,
  ]

  const flatCoords = {}

  flatCoords.TILE_FACE = TILE_FACE
  flatCoords.LEFT_VERT = [
    TILE_FACE[0], TILE_FACE[1],
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + defaultAltitude,
    TILE_FACE[0], TILE_FACE[1] + defaultAltitude,
  ]
  flatCoords.CENTER_VERT = [
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + defaultAltitude,
    TILE_FACE[4], TILE_FACE[5] + defaultAltitude,
    TILE_FACE[4], TILE_FACE[5],
  ]
  flatCoords.RIGHT_VERT = [
    TILE_FACE[6], TILE_FACE[7],
    TILE_FACE[4], TILE_FACE[5],
    TILE_FACE[4], TILE_FACE[5] + defaultAltitude,
    TILE_FACE[6], TILE_FACE[7] + defaultAltitude,
  ]

  return flatCoords
})

function create({
  q,
  r,
  x,
  y,
  zIndex,
  radius,
  color = 0xFF7700 + Math.abs(q + r) * 80,
  orientation = ORIENTATION.POINTY,
  angle = 1.0,
}) {
  // TODO
  // TODO These can all share the same PIXI.GraphicsGeometry instance!
  // TODO
  let hexagon = new PIXI.Graphics()

  // TODO These properties should be transient based on the rotation of the map, the x,y
  // coordinates need to be calculated dynamically based on each tiles axial coordinate
  // and the view of the 'camera'
  hexagon.x = x
  hexagon.y = y

  if (orientation === ORIENTATION.POINTY) {
    let coords = COORDS.POINTY({ angle, radius })

    hexagon.beginFill(color - 0x000066)
    hexagon.drawPolygon(coords.LEFT_VERT)
    hexagon.endFill()

    hexagon.beginFill(color - 0x000033)
    hexagon.drawPolygon(coords.RIGHT_VERT)
    hexagon.endFill()

    // Draw main tile face
    hexagon.beginFill(color)
    hexagon.drawPolygon(coords.TILE_FACE)
    hexagon.endFill()
  } else if (orientation === ORIENTATION.FLAT) {
    let coords = COORDS.FLAT({ angle, radius })

    hexagon.beginFill(color - 0x000066)
    hexagon.drawPolygon(coords.LEFT_VERT)
    hexagon.drawPolygon(coords.RIGHT_VERT)
    hexagon.endFill()

    hexagon.beginFill(color - 0x000033)
    hexagon.drawPolygon(coords.CENTER_VERT)
    hexagon.endFill()

    // Draw main tile face
    hexagon.beginFill(color)
    hexagon.drawPolygon(coords.TILE_FACE)
    hexagon.endFill()
  } else {
    throw new Error('Invalid orientation provided');
  }

  hexagon.zIndex = zIndex

  return hexagon
}

export default {
  create,
  ORIENTATION,
  dimensions,
}
