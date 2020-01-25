import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import Dock from './dock'
import TileBuilder from './tileBuilder'
import { actions } from '../store'

export default () => ({
  view: () => (
    <div
      class='h-full flex flex-row bg-black'
      tabindex={0}
      onkeydown={actions.SetShift}
      onkeyup={actions.SetShift}
    >
      <Sidebar />
      <TileBuilder />
      <RenderPane />
      <Dock />
      <Compass />
    </div>
  ),
})
