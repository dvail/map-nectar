import * as PIXI from 'pixi.js'

import { HexCoords } from "./hexagon"
import { RotationInterval } from "../store"
import { ORIENTATION, getTileCoords } from '../util/math'

export default function CursorHighlight() {
  let hex = new PIXI.Graphics()

  function drawAt(q: number, r: number, rotation: RotationInterval, radius: number, angle: number, altitude: number) {
    let { x, y, zIndex, orientation } = getTileCoords(q, r, rotation, angle, radius)
    let coords = HexCoords[orientation]({ angle, radius, altitude })

    hex.clear()
    hex.lineStyle(3, 0xffffff, 0.7, 0, false)
    hex.drawPolygon(coords.TILE_FACE)

    if (orientation === ORIENTATION.POINTY) {
      hex.x = x + (radius * Math.sqrt(3)) / 2
      hex.y = y + radius * angle
    } else {
      hex.x = x + radius
      hex.y = y + ((radius * Math.sqrt(3)) * angle) / 2
    }
    hex.zIndex = zIndex + 0.5
  }

  function destroy() {
    hex.destroy()
  }

  return {
    drawAt,
    destroy,
    container: hex,
  }
}
