import m from 'mithril'
import range from 'lodash/range'

import { RotationIncrement } from '../appState'
import { tw } from '../util'

let markerWidth = 'w-4'

let DegreeMarkerStyle = tw`
  h-4 w-4
  cursor-pointer
  rounded-full
`

const DegreeMarker = {
  view: ({ attrs: { state, actions, ri } }) => (
    m(DegreeMarkerStyle, {
      class: `${state.rotation === ri ? 'bg-red-600' : 'bg-blue-600'}`,
      onclick: () => actions.SetRotation(ri),
    })
  ),
}

let DegreeMarkerWrapStyle = tw`
  h-1/2 w-4
  m-auto
  absolute
  top-0 left-0 right-0
  transform-origin-bc
`

const DegreeMarkerWrap = {
  view: ({ attrs: { state, actions, ri } }) => (
    m(DegreeMarkerWrapStyle, {
      style: { transform: `rotate(${180 - ri}deg)` },
    }, m(DegreeMarker, { state, actions, ri }))
  ),
}

let CompassStyle = tw`
  w-32 h-32
  absolute top-0 right-0
`

const Compass = {
  view: ({ attrs: { state, actions } }) => {
    let degreeMarkers = range(0, 360, RotationIncrement).map(ri => (
      m(DegreeMarkerWrap, { state, actions, ri })
    ))

    return m(CompassStyle, degreeMarkers)
  },
}

export default Compass
