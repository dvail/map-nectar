import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import TileBuilder from './tileBuilder'

import { html } from '../util'

export default ({ attrs: { states, actions } }) => ({
  view: () => html`
      <div 
        class='h-full flex flex-row bg-black'
        tabindex=0,
        onkeydown=${e => actions.SetShift(e)}
        onkeyup=${e => actions.SetShift(e)}
      >
        <!-- TODO Don't call "states()" here if possible, call lower in the component tree -->
        <${Sidebar} state=${states()} actions=${actions}/>
        <${TileBuilder} state=${states()} actions=${actions}/>

        <div class='relative flex-1'>
          <${RenderPane} state=${states()} actions=${actions}/>
        </div>

        <${Dock} state=${states()} actions=${actions}/>
        <${Compass} state=${states()} actions=${actions}/>
      </div>
  `,
})
