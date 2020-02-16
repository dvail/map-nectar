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
const altitudePixelOffsetRatio = 40

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
  let { height } = dimensions(radius, ORIENTATION.FLAT)
  let tileAltitude = altitudePixelOffsetRatio * altitude
  let halfHeight = height / 2
  let halfRadius = radius / 2
  let vertHeight = 1.0 - angle

  let TILE_FACE = [
        -radius,                  0 - tileAltitude * vertHeight,
    -halfRadius,  halfHeight * angle - tileAltitude * vertHeight,
     halfRadius,  halfHeight * angle - tileAltitude * vertHeight,
         radius,                  0 - tileAltitude * vertHeight,
     halfRadius, -halfHeight * angle - tileAltitude * vertHeight,
    -halfRadius, -halfHeight * angle - tileAltitude * vertHeight,
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

const textureMemoKey = ({ orientation, radius, angle, altitude }) => `${orientation}:${radius}:${angle}:${altitude}`

let Texture = memoize(({ renderer, orientation, radius, angle, altitude }) => {
  let coords = COORDS[orientation]({ angle, radius, altitude })
  let hex = new PIXI.Graphics()

  hex.lineStyle(0, 0, 0, 0, false)
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
  let hexContainer = new PIXI.Container()
  let imageSprite = null
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
    orientation = ORIENTATION.POINTY,
    angle = 1.0,
    tileImage,
    tileTextures = {},
  }) {
    hexContainer.x = x
    hexContainer.y = y
    hexContainer.zIndex = zIndex

    hexContainer.children.forEach(child => {
      // TODO Don't destory these - keep in cache!
      hexContainer.removeChild(child)
      child.destroy()
    })

    if (imageSprite) {
      imageSprite.destroy()
      imageSprite = null
      spriteContainer.destroy()
      spriteContainer = null
    }

    drawFromGraphics(x, y, altitude, radius, orientation, angle, fillColor)

    if (tileImage && tileTextures[tileImage]) {
      drawFromImage(x, y, altitude, radius, orientation, angle, tileImage, tileTextures)
    }
  }

  function drawFromGraphics(x, y, altitude, radius, orientation, angle, fillColor) {
    let texture = Texture({ renderer, orientation, radius, angle, altitude })
    let hexSprite = new PIXI.Sprite(texture)
    let vertHeight = 1.0 - angle
    hexSprite.tint = fillColor
    // TODO These +1s are hacks to prevent spacing between tiles
    hexSprite.width += 1
    hexSprite.height += 1
    hexSprite.y = -(altitude * altitudePixelOffsetRatio * vertHeight)

    hexContainer.addChild(hexSprite)
  }

  function drawFromImage(x, y, altitude, radius, orientation, angle, tileImage, tileTextures) {
    // A container is required so that we can scale the image and then rotate
    // inside the container to prevent skewing
    let scale = (radius * 2) / tileTextures[tileImage].height
    let vertHeight = 1.0 - angle
    spriteContainer = new PIXI.Container()
    spriteContainer.scale = { x: scale, y: scale * angle }
    spriteContainer.y = (altitudePixelOffsetRatio * altitude * -vertHeight)

    imageSprite = new PIXI.Sprite(tileTextures[tileImage])
    imageSprite.anchor.set(0.5, 0.5)
    imageSprite.width += 2 // TODO This is a hack to prevent spacing between tiles
    imageSprite.height += 2 // TODO This is a hack to prevent spacing between tiles

    // Darken lower tiles to give some illusion of depth
    let darkenRate = (altitude * 2 - 10) * 8
    imageSprite.tint = ColorUtils.shift(0xffffff, darkenRate, darkenRate, darkenRate)

    if (orientation === ORIENTATION.POINTY) {
      imageSprite.x += imageSprite.width / 2
      imageSprite.y += imageSprite.height / 2
      imageSprite.y -= 1
      imageSprite.rotation = 0
    }

    if (orientation === ORIENTATION.FLAT) {
      spriteContainer.x += radius
      spriteContainer.y += dimensions(radius, orientation).height * angle / 2
      imageSprite.rotation = Math.PI / 6
    }

    // TODO Verify that this does not cause a memory leak
    spriteContainer.addChild(imageSprite)
    hexContainer.addChild(spriteContainer)
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
