import m from 'mithril'

import Meiosis from './meiosis';
import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'

import './index.css'

const mRoot = document.querySelector('.m-app')
const { states, actions } = Meiosis()

const rootComp = () => ({
  view: () => m(
    '.app-layout',
    {
      style: { backgroundColor: 'transparent' },
      onkeydown: e => actions.setShift(e),
      onkeyup: e => actions.setShift(e),
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
