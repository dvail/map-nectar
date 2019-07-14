import * as PIXI from 'pixi.js'

const HEX_RADIUS = 60
const HEX_WIDTH = HEX_RADIUS * Math.sqrt(3)

const COORDS = {
  POINTY: {
    TILE_FACE: [
      -HEX_WIDTH / 2, HEX_RADIUS / 2,
      -HEX_WIDTH / 2, -HEX_RADIUS / 2,
      0, -HEX_RADIUS,
      HEX_WIDTH / 2, -HEX_RADIUS / 2,
      HEX_WIDTH / 2, HEX_RADIUS / 2,
      0, HEX_RADIUS,
    ],
    LEFT_VERT: [
      -HEX_WIDTH / 2, -HEX_RADIUS / 2,
      -HEX_WIDTH / 2, (HEX_RADIUS / 2) + (HEX_WIDTH / 2),
      0, HEX_RADIUS + (HEX_WIDTH / 2),
      0, -HEX_RADIUS,
    ],
    RIGHT_VERT: [
    ],
  },
  FLAT: {
  }
}

function create({ x, y, color = 0xFF7700 }) {
  let hexagon = new PIXI.Graphics()

  hexagon.x = x
  hexagon.y = y

  hexagon.beginFill(0xff0000)
  hexagon.drawPolygon(COORDS.POINTY.LEFT_VERT)
  hexagon.drawPolygon(COORDS.POINTY.RIGHT_VERT)
  hexagon.endFill()

  // Draw main tile face
  hexagon.beginFill(color)
  hexagon.drawPolygon(COORDS.POINTY.TILE_FACE)
  hexagon.endFill()

  return hexagon
}


export default {
  create,
}
