import * as PIXI from 'pixi.js'
import _ from 'lodash'

import ColorUtils from './colorUtils'

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

const COORDS = {}

// TODO Are these being memoized correctly? No!
/* eslint-disable indent */
COORDS.POINTY = _.memoize(({ radius, angle, height }) => {
  let { width } = dimensions(radius, ORIENTATION.POINTY)
  let altitude = defaultAltitude * height
  let halfWidth = width / 2
  let halfRadius = radius / 2

  let TILE_FACE = [
    -halfWidth,  halfRadius * angle - altitude,
    -halfWidth, -halfRadius * angle - altitude,
             0,     -radius * angle - altitude,
     halfWidth, -halfRadius * angle - altitude,
     halfWidth,  halfRadius * angle - altitude,
             0,      radius * angle - altitude,
  ]

  let LEFT_VERT = [
    TILE_FACE[0],  TILE_FACE[1],
    TILE_FACE[0],  TILE_FACE[1]  + altitude,
    TILE_FACE[10], TILE_FACE[11] + altitude,
    TILE_FACE[10], TILE_FACE[11],
  ]

  let RIGHT_VERT = [
    TILE_FACE[10], TILE_FACE[11],
    TILE_FACE[10], TILE_FACE[11] + altitude,
    TILE_FACE[8],  TILE_FACE[9]  + altitude,
    TILE_FACE[8],  TILE_FACE[9],
  ]

  return { TILE_FACE, LEFT_VERT, RIGHT_VERT }
})

COORDS.FLAT = _.memoize(({ radius, angle, height }) => {
  let { width } = dimensions(radius, ORIENTATION.POINTY)
  let altitude = defaultAltitude * height
  let halfWidth = width / 2
  let halfRadius = radius / 2

  let TILE_FACE = [
        -radius,                  0 - altitude,
    -halfRadius,  halfWidth * angle - altitude,
     halfRadius,  halfWidth * angle - altitude,
         radius,                  0 - altitude,
     halfRadius, -halfWidth * angle - altitude,
    -halfRadius, -halfWidth * angle - altitude,
  ]

  let LEFT_VERT = [
    TILE_FACE[0], TILE_FACE[1],
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + altitude,
    TILE_FACE[0], TILE_FACE[1] + altitude,
  ]

  let CENTER_VERT = [
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + altitude,
    TILE_FACE[4], TILE_FACE[5] + altitude,
    TILE_FACE[4], TILE_FACE[5],
  ]

  let RIGHT_VERT = [
    TILE_FACE[6], TILE_FACE[7],
    TILE_FACE[4], TILE_FACE[5],
    TILE_FACE[4], TILE_FACE[5] + altitude,
    TILE_FACE[6], TILE_FACE[7] + altitude,
  ]

  return { TILE_FACE, LEFT_VERT, CENTER_VERT, RIGHT_VERT }
})
/* eslint-enable indent */

function create({
  q,
  r,
  x,
  y,
  zIndex,
  height,
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
    let coords = COORDS.POINTY({ angle, radius, height })

    hexagon.beginFill(ColorUtils.darken(color, 20))
    hexagon.drawPolygon(coords.LEFT_VERT)
    hexagon.endFill()

    hexagon.beginFill(ColorUtils.darken(color, 40))
    hexagon.drawPolygon(coords.RIGHT_VERT)
    hexagon.endFill()

    // Draw main tile face
    hexagon.beginFill(color)
    hexagon.drawPolygon(coords.TILE_FACE)
    hexagon.endFill()
  } else if (orientation === ORIENTATION.FLAT) {
    let coords = COORDS.FLAT({ angle, radius, height })

    hexagon.beginFill(ColorUtils.darken(color, 40))
    hexagon.drawPolygon(coords.LEFT_VERT)
    hexagon.drawPolygon(coords.RIGHT_VERT)
    hexagon.endFill()

    hexagon.beginFill(ColorUtils.darken(color, 20))
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
