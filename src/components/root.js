import m from 'mithril'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import TileBuilder from './tileBuilder'

import { tw } from '../util'

let AppLayoutStyle = tw`h-full flex flex-row bg-black`
let RenderPaneWrapStyle = tw`relative flex-1`

export default ({ attrs: { states, actions } }) => ({
  view: () => m(
    AppLayoutStyle,
    {
      tabindex: 0,
      onkeydown: e => actions.SetShift(e),
      onkeyup: e => actions.SetShift(e),
    },

    m(Sidebar, { state: states(), actions }),
    m(TileBuilder, { state: states(), actions }),
    m(
      RenderPaneWrapStyle,
      m(RenderPane, { state: states(), actions }),
    ),

    m(Dock, { state: states(), actions }),
    m(Compass, { state: states(), actions }),
  ),
})
