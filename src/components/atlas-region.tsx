import * as React from 'react'

// TODO Is this better defined or inferred from somewhere else?
export interface TextureAtlas {
  x: number
  y: number
  w: number
  h: number
}

interface AtlasRegionProps {
  atlas: {
    [region: string]: TextureAtlas
  }
  region: string
  image: string
  scale: number
  onClick(event: React.MouseEvent): void
}

export default function AtlasRegion({ atlas, region, image, scale, onClick }: AtlasRegionProps) {
  let { x, y, w, h } = atlas[region]

  let wrapperStyle = {
    height: `${h * scale}px`,
    width: `${w * scale}px`,
  }

  let style = {
    height: `${h}px`,
    width: `${w}px`,
    transform: `scale(${scale})`,
    backgroundImage: `url('${image}')`,
    backgroundPosition: `-${x}px -${y}px`,
  }

  return (
    <div style={wrapperStyle} onClick={onClick}>
      <div style={style} className='transform-origin-tl bg-no-repeat' />
    </div>
  )
}
