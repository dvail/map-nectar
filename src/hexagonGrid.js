import _ from 'lodash'
import Hexagon from './hexagon'

const axialCoord = _.memoize(([q, r]) => [q, r].toString());

const calcOffset = {
}

function create({ x, y, tileSize, orientation = Hexagon.ORIENTATION.POINTY, angle = 1.0 }) {
  let tiles = new Map()

  setAt(0, 0, {})
  setAt(1, 0, {})
  setAt(2, 0, {})
  setAt(3, 0, {})
  setAt(0, 1, {})
  setAt(2, 1, {})
  setAt(3, 1, {})

  function getAt(q, r) {
    return tiles.get(axialCoord(q, r))
  }

  function setAt(q, r, opts) {
    let xOffset = (tileSize * Math.sqrt(3)) * (q + (r % 2) / 2)
    let yOffset = (tileSize * 4 / 3) * r * angle

    if (orientation === Hexagon.ORIENTATION.FLAT) {
      [yOffset, xOffset] = [xOffset, yOffset] // FLIP!
    }

    let hexagon = Hexagon.create({
      x: x + xOffset,
      y: y + yOffset,
      orientation,
      angle,
      radius: tileSize,
    })
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
}
