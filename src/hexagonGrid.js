import _ from 'lodash'
import Hexagon from './hexagon'

const DIRECTION = Object.freeze({
  N: 'NORTH',
  S: 'SOUTH',
  NE: 'NORTHEAST',
  SE: 'SOUTHEAST',
  NW: 'NORTHWEST',
  SW: 'SOUTHWEST',
})

const axialCoord = _.memoize(([q, r]) => [q, r].toString());

// TODO Depending on how rotation is handled this might only need x, y, and orientaion
function getZIndex(q, r, s, orientation) {
  if (orientation === Hexagon.ORIENTATION.POINTY) {
    return r;
  } else {
    return q + r + r
  }
}

function create({
  x,
  y,
  tileSize,
  orientation = Hexagon.ORIENTATION.POINTY,
  angle = 1.0,
  direction = DIRECTION.N,
}) {
  let tiles = new Map()

  setAt(-1, -1, {})
  setAt(0, -1, {})
  setAt(1, -1, {})
  setAt(-1, 0, {})
  // setAt(0, 0, {})
  setAt(1, 0, {})
  setAt(2, 0, {})
  setAt(3, 0, {})
  setAt(-1, 1, {})
  setAt(0, 1, {})
  setAt(1, 1, {})

  setAt(-1, 2, {})
  setAt(0, 2, {})
  setAt(1, 2, {})

  function getAt(q, r) {
    return tiles.get(axialCoord(q, r))
  }

  function setAt(q, r, opts) {
    const { width, height } = Hexagon.dimensions(tileSize, orientation)

    let xOffset = width * (q + (r / 2))
    let yOffset = (height * 3 / 4) * r * angle

    if (orientation === Hexagon.ORIENTATION.FLAT) {
      xOffset = width * q * (3 / 4)
      yOffset = height * (r + (q / 2)) * angle
    }

    let hexagon = Hexagon.create({
      x: x + xOffset,
      y: y + yOffset,
      orientation,
      angle,
      radius: tileSize,
    })
    hexagon.zIndex = getZIndex(q, r, 0 - q - r, orientation)

    tiles.set(axialCoord([q, r]), hexagon)
  }

  function getTiles() {
    return tiles
  }

  return {
    getAt,
    setAt,
    getTiles,
  }
}

export default {
  create,
  DIRECTION,
}
