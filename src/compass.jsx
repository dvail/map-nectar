import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

import { Colors } from '@blueprintjs/core';

import { MapViewAction, RotationIncrement } from './mapViewReducer'

const StyledCompass = styled.div`
  width: 150px;
  height: 150px;
  top: 0;
  right: 0;
  position: absolute;
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

const { SetRotation } = MapViewAction

export default function Compass({ rotation, mapViewDispatch }) {
  return (
    <StyledCompass>
      {
        _.range(0, 360, RotationIncrement).map(ri => (
          <DegreeMarkerWrap key={ri} rotation={ri}>
            <DegreeMarker
              selected={rotation === ri}
              onClick={() => mapViewDispatch({ type: SetRotation, data: ri })}
            />
          </DegreeMarkerWrap>
        ))
      }
    </StyledCompass>
  )
}
