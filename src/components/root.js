import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import TileBuilder from './tileBuilder'

export default ({ attrs: { states, actions } }) => ({
  view: () => (
    <div
      class='h-full flex flex-row bg-black'
      tabindex={0}
      onkeydown={actions.SetShift}
      onkeyup={actions.SetShift}
    >
      { /* TODO Don't call "states()" here if possible, call lower in the component tree */ }
      <Sidebar states={states} actions={actions} />
      <TileBuilder state={states()} actions={actions} />

      <div class='relative flex-1'>
        <RenderPane state={states()} actions={actions} />
      </div>

      <Dock state={states()} actions={actions} />
      <Compass state={states()} actions={actions} />
    </div>
  ),
})
