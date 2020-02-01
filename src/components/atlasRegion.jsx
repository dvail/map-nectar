import React from 'react'

export default function AtlasRegion({ atlas, region, image, scale, onClick }) {
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
