import m from 'mithril'
import './msidebar.css'

const Icon = {
  view: ({ attrs: { type } }) => m(
    'span.icon.touch-icon',
    m(`i.fas.fa-2x.${type}`),
  ),
}

function MSidebar() {
  return {
    view: () => m(
      '.main-sidebar',
      m('.sidebar-group.sidebar-top'),
      m(
        '.sidebar-group.sidebar-bottom',
        m(Icon, { type: 'fa-save' }),
        m(
          'label',
          m('.hidden-input'),
          m(Icon, { type: 'fa-file-upload' }),
        ),
      ),
    ),
  }
}

export default MSidebar
