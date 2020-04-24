// TODO There is likely a library that can better replace a lot of this

import { RGBColor } from "react-color"

/**
 *  @param color a hex formatted Number, e.g 0xFF00BB
 *  @param amount how much to darken by, should be 0 <= x <= 256
*/
export function darken(color: number, amount: number) {
  let r = Math.max(0, ((color & 0xFF0000) >> 16) - amount)
  let g = Math.max(0, ((color & 0x00FF00) >> 8)  - amount)
  let b = Math.max(0,  (color & 0x0000FF)        - amount)

  return (r << 16) + (g << 8) + b
}

export function shift(color: number, rShift: number, gShift: number, bShift: number) {
  let r = Math.min(255, Math.max(0, ((color & 0xFF0000) >> 16) + rShift))
  let g = Math.min(255, Math.max(0, ((color & 0x00FF00) >> 8)  + gShift))
  let b = Math.min(255, Math.max(0,  (color & 0x0000FF)        + bShift))

  return (r << 16) + (g << 8) + b
}

export function fromRGB({ r, g, b }: RGBColor) {
  return (r << 16) + (g << 8) + b
}

export function toHexString({ r, g, b }: RGBColor): string {
  return ((r << 16) + (g << 8) + b).toString(16)
}
