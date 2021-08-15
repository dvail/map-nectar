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

function HelpDisplay() {
  return (
    <table>
      <tbody>
        <tr><td>Right Click</td><td>Increase Tile Height</td></tr>
        <tr><td>Shift + Right Click</td><td>Decrease Tile Height</td></tr>
      </tbody>
    </table>
  )
}

export default function HelpPanel() {
  let [open, setOpen] = useState(false)

  return (
    <div 
      className={`text-white bg-gray-800 p-4 absolute bottom-2 right-2 cursor-pointer`}
      onClick={() => { setOpen(!open) }}
    >
      {open ? <HelpDisplay /> : <HelpIcon />}
    </div>
  )
}
