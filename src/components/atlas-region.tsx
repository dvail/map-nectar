import * as React from 'react'

// TODO Is this better defined or inferred from somewhere else?
export interface TextureRegion {
  x: number
  y: number
  w: number
  h: number
}

interface AtlasRegionProps {
  tileSet: string
  region: TextureRegion
  image: string
  scale: number
  onClick(event: React.MouseEvent): void
}

export default function AtlasRegion({ tileSet, region, image, scale, onClick }: AtlasRegionProps) {
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
