import m from 'mithril'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'

import './root.css'

export default ({ attrs: { states, actions } }) => ({
  view: () => m(
    '.app-layout',
    {
      style: { backgroundColor: 'transparent' },
      tabindex: 0,
      onkeydown: e => actions.SetShift(e),
      onkeyup: e => actions.SetShift(e),
    },
    m(Sidebar, { state: states(), actions }),
    m(
      '.workspace',
      m(RenderPane, { state: states(), actions }),
    ),
    m(Dock, { state: states(), actions }),
    m(Compass, { state: states(), actions }),
  ),
})
