import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

import { Colors } from '@blueprintjs/core';

const StyledCompass = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${Colors.DARK_GRAY2}
  position: relative;
`

const DegreeMarkerWrap = styled.div`
  transform: rotate(${props => 180 - props.rotation}deg);
  transform-origin: bottom center;
  position: absolute;
  top: 0; left: 0; right: 0; 
  margin: auto;
  height: 50%; width: 20px;
`

const DegreeMarker = styled.div`
  background-color: ${props => (props.selected ? Colors.VERMILION4 : Colors.COBALT4)};
  border-radius: 100%;
  cursor: pointer;
  height: 20px; width: 20px;
`

export default function Compass(props) {
  return (
    <StyledCompass>
      {
        _.range(0, 360, 360 / 12).map(rotation => (
          <DegreeMarkerWrap
            key={rotation}
            rotation={rotation}
          >
            <DegreeMarker
              selected={props.rotation === rotation}
              onClick={() => props.onRotationChange(rotation)}
            />
          </DegreeMarkerWrap>
        ))
      }
    </StyledCompass>
  )
}
