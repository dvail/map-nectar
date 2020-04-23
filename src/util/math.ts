// Much of this adapted from https://www.redblobgames.com/grids/hexagons/

import { RotationInterval } from "../store"

export enum ORIENTATION {
  POINTY = 'POINTY',
  FLAT = 'FLAT'
}

export function worldToFlatHex(x: number, y: number, radius: number) {
  let q = ((2 / 3) * x) / radius
  let r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / radius
  return hexRound(q, r)
}

export function worldToPointyHex(x: number, y: number, radius: number) {
  let q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / radius
  let r = ((2 / 3) * y) / radius
  return hexRound(q, r)
}

function cubeRound(x: number, y: number, z: number) {
  let rx = Math.round(x)
  let ry = Math.round(y)
  let rz = Math.round(z)

  let xDiff = Math.abs(rx - x)
  let yDiff = Math.abs(ry - y)
  let zDiff = Math.abs(rz - z)

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz
  } else if (yDiff > zDiff) {
    ry = -rx - rz
  } else {
    rz = -rx - ry
  }

  return [rx, ry, rz]
}

function hexRound(q: number, r: number) {
  let [x, y, z] = axialToCube(q, r)
  let [rx, ry, rz] = cubeRound(x, y, z)

  return cubeToAxial(rx, ry, rz)
}

function cubeToAxial(x: number, y: number, z: number) {
  let q = x
  let r = z

  if (Object.is(q, -0)) q = 0
  if (Object.is(r, -0)) r = 0

  return [q, r]
}

function axialToCube(q: number, r: number) {
  let x = q
  let z = r
  let y = -x - z
  return [x, y, z]
}

export function rotatePoint(cx: number, cy: number, angle: number, px: number, py: number) {
  let radians = toRadians(angle)

  let s = Math.sin(radians);
  let c = Math.cos(radians);

  px -= cx;
  py -= cy;

  // rotate point
  let xnew = px * c - py * s;
  let ynew = px * s + py * c;

  // translate point back:
  return [
    xnew + cx,
    ynew + cy,
  ]
}

export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

interface ViewCoordinate {
  viewQ: number
  viewR: number
}

export function getAxialViewCoords(q: number, r: number, rotation: RotationInterval): ViewCoordinate {
  const s = 0 - q - r

  let defaultCoords = { viewQ: q, viewR: r }

  let viewCoords = {
    0: { viewQ: q, viewR: r },
    30: { viewQ: q, viewR: r },
    60: { viewQ: -r, viewR: -s },
    90: { viewQ: -r, viewR: -s },
    120: { viewQ: s, viewR: q },
    150: { viewQ: s, viewR: q },
    180: { viewQ: -q, viewR: -r },
    210: { viewQ: -q, viewR: -r },
    240: { viewQ: r, viewR: s },
    270: { viewQ: r, viewR: s },
    300: { viewQ: -s, viewR: -q },
    330: { viewQ: -s, viewR: -q },
  }[rotation] ?? defaultCoords

  if (Object.is(viewCoords.viewQ, -0)) viewCoords.viewQ = 0
  if (Object.is(viewCoords.viewR, -0)) viewCoords.viewR = 0

  return viewCoords
}

export function hexFromWorldCoords(x: number, y: number, tileRadius: number, viewAngle: number, rotation: RotationInterval, orientation: ORIENTATION) {
  let [unrotatedQ, unrotatedR] = orientation === ORIENTATION.POINTY
    ? worldToPointyHex(x, y / viewAngle, tileRadius)
    : worldToFlatHex(x, y / viewAngle, tileRadius)

  let reverseRotation = 360 - rotation
  if (reverseRotation === 360) reverseRotation = 0

  let viewCords = getAxialViewCoords(unrotatedQ, unrotatedR, reverseRotation as RotationInterval)

  let q = viewCords.viewQ
  let r = viewCords.viewR

  if (orientation === ORIENTATION.FLAT) {
    // q + r is effectively -s (need to document why this works more clearly)
    [q, r] = [-r, q + r]
  }

  return [q, r]
}

function getZIndex(q: number, r: number, s: number, orientation: ORIENTATION) {
  if (orientation === ORIENTATION.POINTY) {
    return r;
  } else {
    return q + r + r
  }
}

export function orientationFromDegrees(degrees: number) {
  return (degrees / 30) % 2 === 0
    ? ORIENTATION.POINTY
    : ORIENTATION.FLAT;
}

export function dimensions(radius: number, orientation: ORIENTATION) {
  let width = Math.sqrt(3) * radius
  let height = radius * 2

  if (orientation === ORIENTATION.FLAT) {
    [width, height] = [height, width]
  }

  return { radius, width, height }
}

export function getTileCoords(q: number, r: number, rotation: RotationInterval, angle: number, radius: number) {
  const { viewQ, viewR } = getAxialViewCoords(q, r, rotation)
  const orientation = orientationFromDegrees(rotation)
  const { width, height } = dimensions(radius, orientation)

  let xOffset = width * (viewQ + (viewR / 2)) - (width / 2)
  let yOffset = height * (3 / 4) * viewR * angle - (radius * angle)

  if (orientation === ORIENTATION.FLAT) {
    xOffset = width * viewQ * (3 / 4) - radius
    yOffset = height * (viewR + (viewQ / 2)) * angle - ((height / 2) * angle)
  }

  return {
    x: xOffset,
    y: yOffset,
    zIndex: getZIndex(viewQ, viewR, 0 - viewQ - viewR, orientation),
    orientation,
  }
}
