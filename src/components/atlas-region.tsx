import * as React from 'react'
import noop from 'lodash/fp/noop'

import { AtlasRegion } from '../store'

interface AtlasRegionProps {
  tileSet: string
  region: AtlasRegion
  scale: number
  onClick?(event: React.MouseEvent): void
}

export default function AtlasImage({ tileSet, region, scale, onClick = noop }: AtlasRegionProps) {
  let { x, y, w, h } = region

  let wrapperStyle = {
    height: `${h * scale}px`,
    width: `${w * scale}px`,
  }

  let style = {
    height: `${h}px`,
    width: `${w}px`,
    transform: `scale(${scale})`,
    // The background image is  set as a global CSS
    // class that is passed in here as a store value in order to avoid multiple parses
    // of base64 image data.
    backgroundPosition: `-${x}px -${y}px`,
  }

  return (
    <div style={wrapperStyle} onClick={onClick}>
      <div style={style} className={`tileset-bg-${tileSet} transform-origin-tl bg-no-repeat`} />
    </div>
  )
}
