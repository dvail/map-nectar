import * as PIXI from 'pixi.js'

import _ from 'lodash'

const ORIENTATION = {
  POINTY: 'POINTY',
  FLAT: 'FLAT',
}


// All of these coordinates will be relative to the actual hexagon positioning
const COORDS = {}

COORDS.POINTY = _.memoize(({ radius, angle }) => {
  const HEX_WIDTH = radius * Math.sqrt(3)
  const TILE_HEIGHT = radius / 2;

  const TILE_FACE = [
    -HEX_WIDTH / 2, (radius / 2) * angle,
    -HEX_WIDTH / 2, (-radius / 2) * angle,
    0, (-radius) * angle,
    HEX_WIDTH / 2, (-radius / 2) * angle,
    HEX_WIDTH / 2, (radius / 2) * angle,
    0, (radius) * angle,
  ]

  const pointyCoords = {}

  pointyCoords.TILE_FACE = TILE_FACE
  pointyCoords.LEFT_VERT = [
    TILE_FACE[0], TILE_FACE[1],
    TILE_FACE[0], TILE_FACE[1] + TILE_HEIGHT,
    TILE_FACE[10], TILE_FACE[11] + TILE_HEIGHT,
    TILE_FACE[10], TILE_FACE[11],
  ]
  pointyCoords.RIGHT_VERT = [
    TILE_FACE[10], TILE_FACE[11],
    TILE_FACE[10], TILE_FACE[11] + TILE_HEIGHT,
    TILE_FACE[8], TILE_FACE[9] + TILE_HEIGHT,
    TILE_FACE[8], TILE_FACE[9],
  ]
  return pointyCoords
})

COORDS.FLAT = _.memoize(({ radius, angle }) => {
  const HEX_WIDTH = radius * Math.sqrt(3)
  const TILE_HEIGHT = radius / 2;

  const TILE_FACE = [
    -radius, 0 * angle,
    -radius / 2, (HEX_WIDTH / 2) * angle,
    radius / 2, (HEX_WIDTH / 2) * angle,
    radius, 0 * angle,
    radius / 2, (-HEX_WIDTH / 2) * angle,
    -radius / 2, (-HEX_WIDTH / 2) * angle,
  ]

  const flatCoords = {}

  flatCoords.TILE_FACE = TILE_FACE
  flatCoords.LEFT_VERT = [
    TILE_FACE[0], TILE_FACE[1],
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + TILE_HEIGHT,
    TILE_FACE[0], TILE_FACE[1] + TILE_HEIGHT,
  ]
  flatCoords.CENTER_VERT = [
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + TILE_HEIGHT,
    TILE_FACE[4], TILE_FACE[5] + TILE_HEIGHT,
    TILE_FACE[4], TILE_FACE[5],
  ]
  flatCoords.RIGHT_VERT = [
    TILE_FACE[6], TILE_FACE[7],
    TILE_FACE[4], TILE_FACE[5],
    TILE_FACE[4], TILE_FACE[5] + TILE_HEIGHT,
    TILE_FACE[6], TILE_FACE[7] + TILE_HEIGHT,
  ]

  return flatCoords
})

function create({
  x,
  y,
  radius,
  color = 0xFF7700,
  orientation = ORIENTATION.POINTY,
  angle = 1.0,
}) {
  let hexagon = new PIXI.Graphics()

  hexagon.x = x
  hexagon.y = y

  if (orientation === ORIENTATION.POINTY) {
    let coords = COORDS.POINTY({ angle, radius })

    hexagon.beginFill(0xc05000)
    hexagon.drawPolygon(coords.LEFT_VERT)
    hexagon.endFill()

    hexagon.beginFill(0xdd5500)
    hexagon.drawPolygon(coords.RIGHT_VERT)
    hexagon.endFill()

    // Draw main tile face
    hexagon.beginFill(color)
    hexagon.drawPolygon(coords.TILE_FACE)
    hexagon.endFill()
  } else if (orientation === ORIENTATION.FLAT) {
    let coords = COORDS.FLAT({ angle, radius })

    hexagon.beginFill(0xc05000)
    hexagon.drawPolygon(coords.LEFT_VERT)
    hexagon.drawPolygon(coords.RIGHT_VERT)
    hexagon.endFill()

    hexagon.beginFill(0xdd5500)
    hexagon.drawPolygon(coords.CENTER_VERT)
    hexagon.endFill()

    // Draw main tile face
    hexagon.beginFill(color)
    hexagon.drawPolygon(coords.TILE_FACE)
    hexagon.endFill()
  } else {
    throw new Error('Invalid orientation provided');
  }

  return hexagon
}

export default {
  create,
  ORIENTATION,
}
