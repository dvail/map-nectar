import _ from 'lodash'
import m from 'mithril'

import { saveObject } from './fileUtils'
import './sidebar.css'

const Icon = {
  view: ({ attrs: { type, onclick } }) => m(
    'span.icon.touch-icon',
    { onclick },
    m(`i.fas.fa-2x.${type}`),
  ),
}

function mapLoad(e, state, actions) {
  let file = _.first(e.target.files)
  let reader = new FileReader()

  reader.onload = event => {
    actions.MapLoad(JSON.parse(event.target.result))
  }

  reader.readAsText(file)
}

const SaveButton = {
  view: ({ attrs: { state } }) => m(
    Icon,
    { type: 'fa-save', onclick: () => saveObject(state.mapData, 'map.json') },
  ),
}

const LoadButton = {
  view: ({ attrs: { state, actions } }) => m(
    'label',
    { for: 'loadMapInput' },
    m(
      'input.hidden-input#loadMapInput',
      { type: 'file', onchange: e => mapLoad(e, state, actions) },
    ),
    m(Icon, { type: 'fa-file-upload' }),
  ),
}

function Sidebar() {
  console.error('Clear out file input after load from sidebar')
  return {
    view: ({ attrs: { state, actions } }) => m(
      '.main-sidebar',
      m('.sidebar-group.sidebar-top'),
      m(
        '.sidebar-group.sidebar-bottom',
        m(SaveButton, { state, actions }),
        m(LoadButton, { state, actions }),
      ),
    ),
  }
}

export default Sidebar
