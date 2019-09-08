import _ from 'lodash'
import m from 'mithril'

import { saveObject, tw } from '../util'

let IconStyle = tw`icon mb-2 mt-2 text-white cursor-pointer`

const Icon = {
  view: ({ attrs: { type, onclick } }) => m(
    `span${IconStyle}`,
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
      'input.hidden#loadMapInput',
      { type: 'file', onchange: e => mapLoad(e, state, actions) },
    ),
    m(Icon, { type: 'fa-file-upload' }),
  ),
}

let SidebarStyle = tw`bg-gray-900 p-3 flex flex-col justify-between`

function Sidebar() {
  console.error('Clear out file input after load from sidebar')
  return {
    view: ({ attrs: { state, actions } }) => m(
      SidebarStyle,
      m('.flex.flex-col'),
      m(
        '.flex.flex-col',
        m(SaveButton, { state, actions }),
        m(LoadButton, { state, actions }),
      ),
    ),
  }
}

export default Sidebar
