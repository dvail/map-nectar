import * as React from 'react'
import range from 'lodash/range'

import { RotationIncrement, useStore } from '../store'

let rotationMarkers = range(0, 360, RotationIncrement)

export interface CompassProps {
  className: string
}

export default function Compass({ className } : CompassProps) {
  let rotation = useStore(state => state.rotation)
  let setRotation = useStore(state => state.setRotation)

  return (
    <div className={`w-32 h-32 absolute top-0 right-0 ${className}`}>
      {rotationMarkers.map(ri => (
        <div
          key={ri}
          className='h-1/2 w-4 m-auto absolute top-0 left-0 right-0 transform-origin-bc'
          style={{ transform: `rotate(${180 - ri}deg)` }}
        >
          <div
            className={`h-4 w-4 cursor-pointer rounded-full ${rotation === ri ? 'bg-indigo-500' : 'border-2 border-indigo-500'}`}
            onClick={() => setRotation(ri)}
          />
        </div>
      ))}
    </div>
  )
}
