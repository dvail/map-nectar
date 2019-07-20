import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledCompass = styled.div`
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.1)
`
export default function Compass() {

  return (
    <StyledCompass>
      <div>o</div>
    </StyledCompass>
  )
}
