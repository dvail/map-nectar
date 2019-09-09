import m from 'mithril'

import FaIcon from './faIcon'
import { tw } from '../util'

let tileBuilderStyle = tw`
  absolute left-0 top-0
  z-10
  ml-16 mt-16
  p-2
  bg-gray-900
  flex flex-row
`

let CloseIcon = {
  view: ({ attrs: { actions } }) => m(
    '.absolute.top-0.left-0.m-2',
    m(FaIcon, { type: 'fa-arrow-circle-left', onclick: () => actions.OpenTileBuilder(false) }),
  ),
}

let TileOptionsPane = {
  view: () => m('div'),
}

let TileDisplayStyle = tw`flex flex-col p-4 items-center`

let HexTileDisplay = {
  view: () => m(
    '.p-2',
    m('.rounded-full.bg-gray-100.h-20.w-20'),
  ),
}

let HexVerticalDisplay = {
  view: () => m(
    '.p-2',
    m('.bg-gray-100.h-8.w-12'),
  ),
}

let HexPropsStyle = {
  view: () => m(
    'div',
    m(FaIcon, { type: 'fa-table', onclick: () => console.warn('open tile props table') }),
  ),
}

function TileBuilder() {
  function view({ attrs: { state, actions } }) {
    return state.tileBuilderOpen ? m(
      tileBuilderStyle,
      m(TileOptionsPane),
      m(TileDisplayStyle,
        m(HexTileDisplay),
        m(HexVerticalDisplay),
        m(HexPropsStyle),
      ),
      m(CloseIcon, { state, actions }),
    ) : ''
  }

  return {
    view,
  }
}

export default TileBuilder
