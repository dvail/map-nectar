import * as PIXI from 'pixi.js'

const ORIENTATION = {
  POINTY: 'POINTY',
  FLAT: 'FLAT',
}

const HEX_RADIUS = 50
const HEX_WIDTH = HEX_RADIUS * Math.sqrt(3)
const TILE_HEIGHT = HEX_RADIUS / 2;
const SKEW_RATIO = 1;

const COORDS = {
  POINTY: {},
  FLAT: {},
}

// TODO Allow dynamic size rendering and memoization
// TODO Allow different viewing angles
//
// All of these coordinates will be relative to the actual hexagon positioning
COORDS.POINTY.TILE_FACE = [
  -HEX_WIDTH / 2, (HEX_RADIUS / 2) * SKEW_RATIO,
  -HEX_WIDTH / 2, (-HEX_RADIUS / 2) * SKEW_RATIO,
  0, (-HEX_RADIUS) * SKEW_RATIO,
  HEX_WIDTH / 2, (-HEX_RADIUS / 2) * SKEW_RATIO,
  HEX_WIDTH / 2, (HEX_RADIUS / 2) * SKEW_RATIO,
  0, (HEX_RADIUS) * SKEW_RATIO,
]
COORDS.POINTY.LEFT_VERT = [
  COORDS.POINTY.TILE_FACE[0], COORDS.POINTY.TILE_FACE[1],
  COORDS.POINTY.TILE_FACE[0], COORDS.POINTY.TILE_FACE[1] + TILE_HEIGHT,
  COORDS.POINTY.TILE_FACE[10], COORDS.POINTY.TILE_FACE[11] + TILE_HEIGHT,
  COORDS.POINTY.TILE_FACE[10], COORDS.POINTY.TILE_FACE[11],
]
COORDS.POINTY.RIGHT_VERT = [
  COORDS.POINTY.TILE_FACE[10], COORDS.POINTY.TILE_FACE[11],
  COORDS.POINTY.TILE_FACE[10], COORDS.POINTY.TILE_FACE[11] + TILE_HEIGHT,
  COORDS.POINTY.TILE_FACE[8], COORDS.POINTY.TILE_FACE[9] + TILE_HEIGHT,
  COORDS.POINTY.TILE_FACE[8], COORDS.POINTY.TILE_FACE[9],
]
COORDS.FLAT.TILE_FACE = [
  -HEX_RADIUS, 0 * SKEW_RATIO,
  -HEX_RADIUS / 2, (HEX_WIDTH / 2) * SKEW_RATIO,
  HEX_RADIUS / 2, (HEX_WIDTH / 2) * SKEW_RATIO,
  HEX_RADIUS, 0 * SKEW_RATIO,
  HEX_RADIUS / 2, (-HEX_WIDTH / 2) * SKEW_RATIO,
  -HEX_RADIUS / 2, (-HEX_WIDTH / 2) * SKEW_RATIO,
]
COORDS.FLAT.LEFT_VERT = [
  COORDS.FLAT.TILE_FACE[0], COORDS.FLAT.TILE_FACE[1],
  COORDS.FLAT.TILE_FACE[2], COORDS.FLAT.TILE_FACE[3],
  COORDS.FLAT.TILE_FACE[2], COORDS.FLAT.TILE_FACE[3] + TILE_HEIGHT,
  COORDS.FLAT.TILE_FACE[0], COORDS.FLAT.TILE_FACE[1] + TILE_HEIGHT,
]
COORDS.FLAT.CENTER_VERT = [
  COORDS.FLAT.TILE_FACE[2], COORDS.FLAT.TILE_FACE[3],
  COORDS.FLAT.TILE_FACE[2], COORDS.FLAT.TILE_FACE[3] + TILE_HEIGHT,
  COORDS.FLAT.TILE_FACE[4], COORDS.FLAT.TILE_FACE[5] + TILE_HEIGHT,
  COORDS.FLAT.TILE_FACE[4], COORDS.FLAT.TILE_FACE[5],
]
COORDS.FLAT.RIGHT_VERT = [
  COORDS.FLAT.TILE_FACE[6], COORDS.FLAT.TILE_FACE[7],
  COORDS.FLAT.TILE_FACE[4], COORDS.FLAT.TILE_FACE[5],
  COORDS.FLAT.TILE_FACE[4], COORDS.FLAT.TILE_FACE[5] + TILE_HEIGHT,
  COORDS.FLAT.TILE_FACE[6], COORDS.FLAT.TILE_FACE[7] + TILE_HEIGHT,
]

function create({ x, y, color = 0xFF7700, orientation = ORIENTATION.POINTY }) {
  let hexagon = new PIXI.Graphics()

  hexagon.x = x
  hexagon.y = y

  if (orientation === ORIENTATION.POINTY) {
    hexagon.beginFill(0xc05000)
    hexagon.drawPolygon(COORDS.POINTY.LEFT_VERT)
    hexagon.endFill()

    hexagon.beginFill(0xdd5500)
    hexagon.drawPolygon(COORDS.POINTY.RIGHT_VERT)
    hexagon.endFill()

    // Draw main tile face
    hexagon.beginFill(color)
    hexagon.drawPolygon(COORDS.POINTY.TILE_FACE)
    hexagon.endFill()
  } else if (orientation === ORIENTATION.FLAT) {
    hexagon.beginFill(0xc05000)
    hexagon.drawPolygon(COORDS.FLAT.LEFT_VERT)
    hexagon.drawPolygon(COORDS.FLAT.RIGHT_VERT)
    hexagon.endFill()

    hexagon.beginFill(0xdd5500)
    hexagon.drawPolygon(COORDS.FLAT.CENTER_VERT)
    hexagon.endFill()

    // Draw main tile face
    hexagon.beginFill(color)
    hexagon.drawPolygon(COORDS.FLAT.TILE_FACE)
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
