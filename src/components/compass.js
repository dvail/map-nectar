import range from 'lodash/range'

import { RotationIncrement } from '../appState'
import { html } from '../util'

let rotationMarkers = range(0, 360, RotationIncrement)

export default {
  view: ({ attrs: { state, actions } }) => html`
    <div class='w-32 h-32 absolute top-0 right-0'>
      ${rotationMarkers.map(ri => html`
        <div 
          class='h-1/2 w-4 m-auto absolute top-0 left-0 right-0 transform-origin-bc' 
          style=${`transform: rotate(${180 - ri}deg)`}
        >
          <div 
            class='h-4 w-4 cursor-pointer rounded-full ${state.rotation === ri ? 'bg-red-600' : 'bg-blue-600'}'
            onclick=${() => actions.SetRotation(ri)}
          />
        </div>
      `)}
    </div>
  `,
}
