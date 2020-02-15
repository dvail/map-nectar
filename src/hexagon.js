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

const textureMemoKey = ({ renderer, orientation, radius, angle, altitude }) => `${orientation}:${radius}:${angle}:${altitude}`

let Texture = memoize(({ renderer, orientation, radius, angle, altitude }) => {
  let coords = COORDS[orientation]({ angle, radius, altitude })
  let hex = new PIXI.Graphics()

  hex.lineStyle(0)
  hex.beginFill(0xffffff)
  hex.drawPolygon(coords.TILE_FACE)
  hex.endFill()

  if (orientation === ORIENTATION.POINTY) {
    hex.beginFill(ColorUtils.darken(0xffffff, 20))
    hex.drawPolygon(coords.LEFT_VERT)
    hex.endFill()

    hex.beginFill(ColorUtils.darken(0xffffff, 40))
    hex.drawPolygon(coords.RIGHT_VERT)
    hex.endFill()
  } else if (orientation === ORIENTATION.FLAT) {
    hex.beginFill(ColorUtils.darken(0xffffff, 40))
    hex.drawPolygon(coords.LEFT_VERT)
    hex.drawPolygon(coords.RIGHT_VERT)
    hex.endFill()

    hex.beginFill(ColorUtils.darken(0xffffff, 20))
    hex.drawPolygon(coords.CENTER_VERT)
    hex.endFill()
  }

  return renderer.generateTexture(hex)
}, textureMemoKey)

export default function Hexagon(renderer, {
  container,
  q,
  r,
  onTileClick = noop,
  onTileRightClick = noop,
}) {
  // TODO
  // TODO These can all share the same PIXI.GraphicsGeometry instance!
  // TODO

  // TODO Also - graphics are slow! Use sprites if possible
  //
  // TODO Probably going to want to get rid of the coloring gradient method for perf reasons
  //
  // TODO Although apparently tinting is "free", so would be best to convert graphics to sprites and tint them (default is a white rect)
  let hexContainer = new PIXI.Container()
  let sprite = null
  let spriteContainer = null

  hexContainer.interactive = true

  hexContainer.on('click', ev => onTileClick(ev, q, r))
  hexContainer.on('rightclick', ev => onTileRightClick(ev, q, r))

  container.addChild(hexContainer)

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
    hexContainer.x = x
    hexContainer.y = y

    hexContainer.children.forEach(child => {
      hexContainer.removeChild(child)
      child.destroy()
    })

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

      hexContainer.addChild(spriteContainer)
    }

    let texture = Texture({ renderer, orientation, radius, angle, altitude })
    let topSprite = new PIXI.Sprite(texture)
    let vertHeight = 1.0 - angle
    topSprite.tint = fillColor
    topSprite.y = -(altitude * altitudePixelOffsetRatio * vertHeight)

    hexContainer.addChild(topSprite)

    hexContainer.zIndex = zIndex
  }

  function destroy() {
    hexContainer.children.forEach(child => child.destroy())
    hexContainer.destroy()
  }

  return {
    draw,
    destroy,
  }
}

export {
  ORIENTATION,
  dimensions,
}
