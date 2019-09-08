import _ from 'lodash'
import m from 'mithril'
import uuidv4 from 'uuid/v4'

import { saveObject, tw } from '../util'
import FaIcon from './faIcon'

function mapLoad(e, state, actions) {
  let file = _.first(e.target.files)
  let reader = new FileReader()

  reader.onload = event => {
    actions.MapLoad(JSON.parse(event.target.result))
  }

  reader.readAsText(file)
}

let SaveButton = {
  view: ({ attrs: { state } }) => m(
    FaIcon,
    { type: 'fa-save', onclick: () => saveObject(state.mapData, 'map.json') },
  ),
}

let LoadButton = {
  view: ({ attrs: { state, actions } }) => {
    let id = uuidv4()
    return m(
      'label', { for: id },
      m(
        `input.hidden#${id}`,
        { type: 'file', onchange: e => mapLoad(e, state, actions) },
      ),
      m(FaIcon, { type: 'fa-file-upload' }),
    )
  },
}

let SidebarStyle = tw`bg-gray-900 p-3 flex flex-col justify-between`
let FlexColStyle = tw`flex flex-col`

function Sidebar() {
  console.error('Clear out file input after load from sidebar')
  return {
    view: ({ attrs: { state, actions } }) => m(
      SidebarStyle,
      m(FlexColStyle),
      m(
        FlexColStyle,
        m(SaveButton, { state, actions }),
        m(LoadButton, { state, actions }),
      ),
    ),
  }
}

export default Sidebar
