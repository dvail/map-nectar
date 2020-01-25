import FaIcon from './faIcon'
import { html } from '../util'

export default {
  view: ({ attrs: { state, actions } }) => {
    if (!state.tileBuilderOpen) return ''

    return html`
      <div class='absolute left-0 top-0 z-10 ml-16 mt-16 p-2 bg-gray-900 flex flex-row'>
        <div/>
        <div class='flex flex-col p-4 items-center'>
          <div class='p-2'>
            <div class='rounded-full bg-gray-100 h-20 w-20' />
          </div>
          <div class='p-2'>
            <div class='bg-gray-100 h-8 w-12' />
          </div>
          <div>
            <${FaIcon} type='fa-table' onclick=${() => console.warn('open tile props table')}/>
          </div>
        </div>
        <div class='absolute top-0 left-0 m-2'>
          <${FaIcon} type='fa-arrow-circle-left' onclick=${() => actions.OpenTileBuilder(false)}/>
        </div>
      </div>
    `
  },
}
