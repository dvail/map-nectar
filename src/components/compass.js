import m from 'mithril'
import _ from 'lodash'
import './compass.css'

import { RotationIncrement } from '../appState'

const DegreeMarker = {
  view: ({ attrs: { state, actions, ri } }) => (
    m('div.compass-degree-marker', {
      style: {
        backgroundColor: `${state.rotation === ri ? 'tomato' : 'royalblue'}`,
      },
      onclick: () => actions.SetRotation(ri),
    })
  ),
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
