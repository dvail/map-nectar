import m from 'mithril'

import { initMeiosis } from './appState';
import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'

import './index.css'

const mRoot = document.querySelector('.app')
const { states, actions } = initMeiosis()

const rootComp = () => ({
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
    m(Compass, { state: states(), actions }),
  ),
})

m.mount(mRoot, rootComp);
