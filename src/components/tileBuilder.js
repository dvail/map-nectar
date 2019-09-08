import m from 'mithril'

import FaIcon from './faIcon'
import { tw } from '../util'

let tileBuilderStyle = tw`
  absolute right-0 top-0 bottom-0
  m-auto mr-1
  bg-gray-900
  h-20 w-20
`

let CloseIcon = {
  view: ({ attrs: { actions } }) => m(
    '.absolute.top-0.right-0',
    m(FaIcon, { type: 'fa-times', onclick: () => actions.OpenTileBuilder(false) }),
  ),
}

function TileBuilder() {
  function view({ attrs: { state, actions } }) {
    return state.tileBuilderOpen ? m(
      tileBuilderStyle,
      m(CloseIcon, { state, actions }),
    ) : ''
  }

  return {
    view,
  }
}

export default TileBuilder
