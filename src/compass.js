import m from 'mithril'
import _ from 'lodash'
import './compass.css'

import { Colors } from '@blueprintjs/core';

import { MapViewAction, RotationIncrement } from './mapViewReducer'

const DegreeMarker = {
  view: vnode => {
    let { rotation, ri, mapViewDispatch } = vnode.attrs
    return m('div.compass-degree-marker', {
      style: {
        backgroundColor: `${rotation === ri ? Colors.VERMILION4 : Colors.COBALT4}`,
      },
      onclick: () => mapViewDispatch({ type: SetRotation, data: ri }),
    })
  },
}

const DegreeMarkerWrap = {
  view: vnode => {
    let { rotation, ri, mapViewDispatch } = vnode.attrs
    return m('div.compass-marker-wrap', {
      style: { transform: `rotate(${180 - ri}deg)` },
    }, m(DegreeMarker, { rotation, ri, mapViewDispatch }))
  },
}

const { SetRotation } = MapViewAction

const Compass = { // ({ rotation, mapViewDispatch }) {
  view: (vnode) => {
    let { rotation, mapViewDispatch } = vnode.attrs
    let degreeMarkers = _.range(0, 360, RotationIncrement).map(ri => (
      m(DegreeMarkerWrap, { rotation, ri, mapViewDispatch })
    ))

    return m('div.compass', degreeMarkers)
  },
}

/*
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
*/

export default Compass
