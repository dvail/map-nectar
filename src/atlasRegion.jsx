import React from 'react'
import styled from 'styled-components'

const Region = styled.div`
    background-repeat: no-repeat;
    background-image: url('${props => props.image}');
    height: ${({ h }) => h}px;
    width: ${({ w }) => w}px;
    background-position: ${({ x }) => -x}px ${({ y }) => -y}px;
    transform-origin: top left;
    transform: scale(${props => props.scale});
`

const Wrapper = styled.div`
    height: ${({ h, scale }) => h * scale}px;
    width: ${({ w, scale }) => w * scale}px;
`

export default function AtlasRegion({ image, atlas, region, scale = 1.0 }) {
  let { x, y, w, h } = atlas[region]

  return (
    <Wrapper h={h} w={w} scale={scale}>
      <Region image={image} x={x} y={y} h={h} w={w} scale={scale} />
    </Wrapper>
  )
}
