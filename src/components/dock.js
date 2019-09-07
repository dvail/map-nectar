import m from 'mithril'

import './dock.scss'

export default function Dock() {
  function view({ attrs: { states, actions } }) {
    return m('.dock')
  }

  return {
    view,
  }
}
