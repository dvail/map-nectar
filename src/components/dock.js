import m from 'mithril'

import AtlasRegion from './atlasRegion'
import completePng from '../../res/complete.png'
import completeJson from '../../res/complete.json'
import './dock.scss'

export default function Dock() {
  function view({ attrs: { states, actions } }) {
    return m(
      '.dock',
      m(
        AtlasRegion,
        {
          states,
          actions,
          image: completePng,
          atlas: completeJson,
          region: "tileRock.png",
          scale: 0.5,
        },
      ),
    )
  }

  return {
    view,
  }
}
