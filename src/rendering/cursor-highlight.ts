import * as PIXI from 'pixi.js'

import { altitudePixelOffsetRatio, HexCoords } from "./hexagon"
import { RotationInterval } from "../store"
import { getTileCoords } from "./hexagon-grid"

export default function CursorHighlight(renderer: PIXI.Renderer) {
  let hexContainer = new PIXI.Container()
  let hexSprite = new PIXI.Sprite()

  function drawAt(q: number, r: number, rotation: RotationInterval, radius: number, angle: number, altitude: number) {
    let { x, y, zIndex, orientation } = getTileCoords(q, r, rotation, angle, radius)
    hexContainer.x = x
    hexContainer.y = y
    // TODO zIndex is screwed up because the highlight exists outside of the HexGrid container
    hexContainer.zIndex = zIndex + 0.5

    hexContainer.removeChild(hexSprite)
    hexSprite.destroy()

    // TODO Optimize this, refactor Hexagon.ts memoization to allow more flexibility with outlines/fill
    let coords = HexCoords[orientation]({ angle, radius, altitude })
    let hex = new PIXI.Graphics()

    hex.lineStyle(3, 0xffffff, 0.7, 0, false)
    hex.drawPolygon(coords.TILE_FACE)

    let texture = renderer.generateTexture(hex, PIXI.SCALE_MODES.LINEAR, 1)
    hexSprite = new PIXI.Sprite(texture)
    let vertHeight = 1.0 - angle

    hexSprite.y = -(altitude * altitudePixelOffsetRatio * vertHeight)

    // Hacks :(
    hexSprite.x -= 2
    hexSprite.y -= 2

    hexContainer.addChild(hexSprite)
  }

  function destroy() {
    hexContainer.destroy()
  }

  return {
    drawAt,
    destroy,
    container: hexContainer,
  }
}
