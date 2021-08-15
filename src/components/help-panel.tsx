import * as React from 'react'
import { useState } from 'react'
import Icon from './bricks/icon'

function HelpIcon() {
  return (
    <Icon
      type="fa fa-question-circle"
      title="Quick Help"
      className='text-2xl'
    />
  )
}

function Cell(props: React.PropsWithChildren<any>) {
  return (<td className="px-2">{props.children}</td>)
}

function HelpDisplay() {
  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -mr-2 -mt-4 text-lg">🗙</div>
      <table>
        <tbody>
          <tr><Cell>Increase Tile Height</Cell><Cell>Right Click</Cell></tr>
          <tr><Cell>Decrease Tile Height</Cell><Cell>Shift + Right Click</Cell></tr>
          <tr><Cell>Move Map</Cell><Cell>Left Click + Drag</Cell></tr>
          <tr><Cell>Rotate Map</Cell><Cell>Shift + Left Click + Drag Left/Right</Cell></tr>
          <tr><Cell>Tilt Map</Cell><Cell>Shift + Left Click + Drag Up/Down</Cell></tr>
        </tbody>
      </table>
    </div>
  )
}

export default function HelpPanel() {
  let [open, setOpen] = useState(false)

  return (
    <div 
      className="text-white bg-gray-800 p-4 absolute bottom-2 right-2 cursor-pointer rounded"
      onClick={() => { setOpen(!open) }}
    >
      {open ? <HelpDisplay /> : <HelpIcon />}
    </div>
  )
}
