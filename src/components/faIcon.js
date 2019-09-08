import m from 'mithril'

import { tw } from '../util'

let IconStyle = tw`icon mb-2 mt-2 text-white cursor-pointer`

function FaIcon() {
  let view = ({ attrs: { type, title, onclick } }) => m(
    `span${IconStyle}`,
    { onclick, title },
    m(`i.fas.fa-2x.${type}`),
  )

  return { view }
}

export default FaIcon
