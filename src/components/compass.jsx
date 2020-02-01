import React from 'react'
import range from 'lodash/range'

import { RotationIncrement, states, actions } from '../store'

let rotationMarkers = range(0, 360, RotationIncrement)

export default function Compass() {
  let { rotation } = states()

  return (
    <div className='w-32 h-32 absolute top-0 right-0'>
      {rotationMarkers.map(ri => (
        <div
          key={ri}
          className='h-1/2 w-4 m-auto absolute top-0 left-0 right-0 transform-origin-bc'
          style={{ transform: `rotate(${180 - ri}deg)` }}
        >
          <div
            className={`h-4 w-4 cursor-pointer rounded-full ${rotation === ri ? 'bg-red-600' : 'bg-blue-600'}`}
            onClick={() => actions.SetRotation(ri)}
          />
        </div>
      ))}
    </div>
  )
}
