import * as PIXI from 'pixi.js'
import noop from 'lodash/noop'
import memoize from 'lodash/memoize'

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

// For an altitude of '1' - how far up should the tile be shifted
const altitudePixelOffsetRatio = 20

const COORDS = {}

const coordinateMemoKey = ({ radius, angle, altitude }) => `${radius}:${angle}:${altitude}`

/* eslint-disable indent */
COORDS.POINTY = memoize(({ radius, angle, altitude }) => {
  let { width } = dimensions(radius, ORIENTATION.POINTY)
  let tileAltitude = altitudePixelOffsetRatio * altitude
  let halfWidth = width / 2
  let halfRadius = radius / 2
  let vertHeight = 1.0 - angle

  let TILE_FACE = [
    -halfWidth,  halfRadius * angle - tileAltitude * vertHeight,
    -halfWidth, -halfRadius * angle - tileAltitude * vertHeight,
             0,     -radius * angle - tileAltitude * vertHeight,
     halfWidth, -halfRadius * angle - tileAltitude * vertHeight,
     halfWidth,  halfRadius * angle - tileAltitude * vertHeight,
             0,      radius * angle - tileAltitude * vertHeight,
  ]

  let LEFT_VERT = [
    TILE_FACE[0],  TILE_FACE[1],
    TILE_FACE[0],  TILE_FACE[1]  + tileAltitude * vertHeight,
    TILE_FACE[10], TILE_FACE[11] + tileAltitude * vertHeight,
    TILE_FACE[10], TILE_FACE[11],
  ]

  let RIGHT_VERT = [
    TILE_FACE[10], TILE_FACE[11],
    TILE_FACE[10], TILE_FACE[11] + tileAltitude * vertHeight,
    TILE_FACE[8],  TILE_FACE[9]  + tileAltitude * vertHeight,
    TILE_FACE[8],  TILE_FACE[9],
  ]

  return { TILE_FACE, LEFT_VERT, RIGHT_VERT }
}, coordinateMemoKey)

COORDS.FLAT = memoize(({ radius, angle, altitude }) => {
  let { width } = dimensions(radius, ORIENTATION.POINTY)
  let tileAltitude = altitudePixelOffsetRatio * altitude
  let halfWidth = width / 2
  let halfRadius = radius / 2
  let vertHeight = 1.0 - angle

  let TILE_FACE = [
        -radius,                  0 - tileAltitude * vertHeight,
    -halfRadius,  halfWidth * angle - tileAltitude * vertHeight,
     halfRadius,  halfWidth * angle - tileAltitude * vertHeight,
         radius,                  0 - tileAltitude * vertHeight,
     halfRadius, -halfWidth * angle - tileAltitude * vertHeight,
    -halfRadius, -halfWidth * angle - tileAltitude * vertHeight,
  ]

  let LEFT_VERT = [
    TILE_FACE[0], TILE_FACE[1],
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + tileAltitude * vertHeight,
    TILE_FACE[0], TILE_FACE[1] + tileAltitude * vertHeight,
  ]

  let CENTER_VERT = [
    TILE_FACE[2], TILE_FACE[3],
    TILE_FACE[2], TILE_FACE[3] + tileAltitude * vertHeight,
    TILE_FACE[4], TILE_FACE[5] + tileAltitude * vertHeight,
    TILE_FACE[4], TILE_FACE[5],
  ]

  let RIGHT_VERT = [
    TILE_FACE[6], TILE_FACE[7],
    TILE_FACE[4], TILE_FACE[5],
    TILE_FACE[4], TILE_FACE[5] + tileAltitude * vertHeight,
    TILE_FACE[6], TILE_FACE[7] + tileAltitude * vertHeight,
  ]

  return { TILE_FACE, LEFT_VERT, CENTER_VERT, RIGHT_VERT }
}, coordinateMemoKey)
/* eslint-enable indent */

function create({
  container,
  q,
  r,
  onTileClick = noop,
  onTileRightClick = noop,
}) {
  // TODO
  // TODO These can all share the same PIXI.GraphicsGeometry instance!
  // TODO
  let hexagon = new PIXI.Graphics()
  let sprite = null
  let spriteContainer = null

  hexagon.interactive = true

  hexagon.on('click', ev => onTileClick(ev, q, r))
  hexagon.on('rightclick', ev => onTileRightClick(ev, q, r))

  container.addChild(hexagon)

  function draw({
    x,
    y,
    zIndex,
    altitude,
    radius,
    fillColor,
    fillAlpha = 1.0,
    strokeColor,
    strokeAlpha = 0.0,
    orientation = ORIENTATION.POINTY,
    angle = 1.0,
    tileImage,
    tileTextures = {},
  }) {
    hexagon.clear();

    hexagon.x = x
    hexagon.y = y

    if (sprite) {
      sprite.destroy()
      sprite = null
      spriteContainer.destroy()
      spriteContainer = null
    }

    if (!sprite && tileImage && tileTextures[tileImage]) {
      sprite = new PIXI.Sprite(tileTextures[tileImage])
      spriteContainer = new PIXI.Container()

      // Scale and offset container
      let scale = (radius * 2) / tileTextures[tileImage].height
      let vertHeight = 1.0 - angle
      spriteContainer.scale = { x: scale, y: scale * angle }
      spriteContainer.y = (altitudePixelOffsetRatio * altitude * -vertHeight)

      // Rotate sprite within the container
      sprite.anchor.set(0.5, 0.5)
      orientation === ORIENTATION.POINTY && (sprite.rotation = 0)
      orientation === ORIENTATION.FLAT && (sprite.rotation = Math.PI / 6)

      spriteContainer.addChild(sprite)
      hexagon.addChild(spriteContainer)
    }

    // TODO Handle the ability to change between PIXI.Graphics and PIXI.Sprite here
    if (orientation === ORIENTATION.POINTY) {
      let coords = COORDS.POINTY({ angle, radius, altitude })

      strokeColor && hexagon.lineStyle(1, strokeColor, strokeAlpha, 0, true)
      fillColor && hexagon.beginFill(ColorUtils.darken(fillColor, 20), fillAlpha)
      hexagon.drawPolygon(coords.LEFT_VERT)
      hexagon.endFill()

      fillColor && hexagon.beginFill(ColorUtils.darken(fillColor, 40), fillAlpha)
      hexagon.drawPolygon(coords.RIGHT_VERT)
      hexagon.endFill()

      // Draw main tile face
      fillColor && hexagon.beginFill(fillColor, fillAlpha)
      hexagon.drawPolygon(coords.TILE_FACE)
      hexagon.endFill()
    } else if (orientation === ORIENTATION.FLAT) {
      let coords = COORDS.FLAT({ angle, radius, altitude })

      strokeColor && hexagon.lineStyle(1, strokeColor, strokeAlpha, 0, true)
      fillColor && hexagon.beginFill(ColorUtils.darken(fillColor, 40), fillAlpha)
      hexagon.drawPolygon(coords.LEFT_VERT)
      hexagon.drawPolygon(coords.RIGHT_VERT)
      hexagon.endFill()

      fillColor && hexagon.beginFill(ColorUtils.darken(fillColor, 20), fillAlpha)
      hexagon.drawPolygon(coords.CENTER_VERT)
      hexagon.endFill()

      // Draw main tile face
      fillColor && hexagon.beginFill(fillColor, fillAlpha)
      hexagon.drawPolygon(coords.TILE_FACE)
      hexagon.endFill()
    } else {
      throw new Error('Invalid orientation provided')
    }

    hexagon.zIndex = zIndex
  }

  function destroy() {
    hexagon.destroy()
  }

  return {
    draw,
    destroy,
  }
}

export default {
  create,
  ORIENTATION,
  dimensions,
}
