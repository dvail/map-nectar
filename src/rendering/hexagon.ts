import * as PIXI from 'pixi.js'
import noop from 'lodash/noop'
import memoize from 'lodash/memoize'

import ColorUtils from '../util/color'
import { ORIENTATION } from '../util/math'

interface HexView {
  radius: number
  angle: number
  altitude: number
  orientation?: ORIENTATION
}

function dimensions(radius: number, orientation: ORIENTATION) {
  let width = Math.sqrt(3) * radius
  let height = radius * 2

  if (orientation === ORIENTATION.FLAT) {
    [width, height] = [height, width]
  }

  return { radius, width, height }
}

// For an altitude of '1' - how far up should the tile be shifted
const altitudePixelOffsetRatio = 40

interface PointyHexGeometry {
  TILE_FACE: number[]
  LEFT_VERT: number[]
  RIGHT_VERT: number[]
}

interface FlatHexGeometry {
  TILE_FACE: number[]
  LEFT_VERT: number[]
  RIGHT_VERT: number[]
  CENTER_VERT: number[]
}

let COORDS: {
  POINTY?(view: HexView): PointyHexGeometry
  FLAT?(view: HexView): FlatHexGeometry
} = {}

const coordinateMemoKey = ({ radius, angle, altitude }: HexView) => `${radius}:${angle}:${altitude}`

/* eslint-disable @typescript-eslint/indent */
COORDS.POINTY = memoize(({ radius, angle, altitude }: HexView) => {
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

COORDS.FLAT = memoize(({ radius, angle, altitude }: HexView) => {
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
/* eslint-enable @typescript-eslint/indent */

const textureMemoKey = ({ orientation, radius, angle, altitude }: HexView) => `${orientation}:${radius}:${angle}:${altitude}`

let Texture = memoize(({ renderer, orientation, radius, angle, altitude }: HexView & { renderer: PIXI.Renderer }) => {
  let coords = COORDS[orientation]({ angle, radius, altitude }) as FlatHexGeometry
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

  return renderer.generateTexture(hex, PIXI.SCALE_MODES.LINEAR, 1)
}, textureMemoKey)

// TODO eww
export interface IHexagon {
  draw(params: HexagonDrawParams): void
  destroy(): void
}

export interface HexagonProps {
  container: PIXI.Container
  q: number
  r: number
  onTileClick: any
  onTileRightClick: any
}

export interface TextureMap {
  [imageName: string]: PIXI.Texture
}

interface HexagonDrawParams {
  x: number,
  y: number,
  zIndex: number,
  altitude: number,
  radius: number,
  fillColor: number,
  orientation?: ORIENTATION
  angle?: number
  tileImage?: string
  tileSet?: string
  tileTextures?: TileSetTextureMap
}

export interface TileSetTextureMap {
  [tileSetId: string]: {
    [region: string]: PIXI.Texture
  }
}

export default function Hexagon(renderer: PIXI.Renderer, {
  container,
  q,
  r,
  onTileClick = noop,
  onTileRightClick = noop,
}: HexagonProps): IHexagon {
  let hexContainer = new PIXI.Container()
  let imageSprite: PIXI.Sprite | null
  let spriteContainer: PIXI.Container | null

  hexContainer.interactive = true

  hexContainer.on('click', (ev: any) => onTileClick(ev, q, r))
  hexContainer.on('rightclick', (ev: any) => onTileRightClick(ev, q, r))

  container.addChild(hexContainer)

  function drawFromGraphics(
    altitude: number,
    radius: number,
    orientation: ORIENTATION,
    angle: number,
    fillColor: number,
  ) {
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

  function drawFromImage(
    altitude: number,
    radius: number,
    orientation: ORIENTATION,
    angle: number,
    tileSet: string,
    tileImage: string,
    tileTextures: TileSetTextureMap,
  ) {
    console.warn(angle)
    // A container is required so that we can scale the image and then rotate
    // inside the container to prevent skewing
    let scale = (radius * 2) / tileTextures[tileSet][tileImage].height
    let vertHeight = 1.0 - angle
    spriteContainer = new PIXI.Container()
    spriteContainer.scale = new PIXI.Point(scale, scale * angle)
    spriteContainer.y = (altitudePixelOffsetRatio * altitude * -vertHeight)

    imageSprite = new PIXI.Sprite(tileTextures[tileSet][tileImage])
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
      spriteContainer.y += (dimensions(radius, orientation).height * angle) / 2
      imageSprite.rotation = Math.PI / 6
    }

    // TODO Verify that this does not cause a memory leak
    spriteContainer.addChild(imageSprite)
    hexContainer.addChild(spriteContainer)
  }

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
    tileSet,
    tileTextures = {},
  }: HexagonDrawParams) {
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

    drawFromGraphics(altitude, radius, orientation, angle, fillColor)

    if (tileImage && tileSet && tileTextures[tileSet][tileImage]) {
      drawFromImage(altitude, radius, orientation, angle, tileSet, tileImage, tileTextures)
    }
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
