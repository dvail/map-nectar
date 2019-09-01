import m from 'mithril'
import _ from 'lodash'
import './compass.css'

import { Colors } from '@blueprintjs/core';

import { RotationIncrement } from './meiosis'

const DegreeMarker = {
  view: ({ attrs: { state, actions, ri } }) => {
    return m('div.compass-degree-marker', {
      style: {
        backgroundColor: `${state.rotation === ri ? Colors.VERMILION4 : Colors.COBALT4}`,
      },
      onclick: () => actions.SetRotation(ri),
    })
  },
}

const DegreeMarkerWrap = {
  view: ({ attrs: { state, actions, ri } }) => {
    return m('div.compass-marker-wrap', {
      style: { transform: `rotate(${180 - ri}deg)` },
    }, m(DegreeMarker, { state, actions, ri }))
  },
}

const Compass = {
  view: ({ attrs: { state, actions } }) => {
    let degreeMarkers = _.range(0, 360, RotationIncrement).map(ri => (
      m(DegreeMarkerWrap, { state, actions, ri })
    ))

    return m('div.compass', degreeMarkers)
  },
}

export default Compass
