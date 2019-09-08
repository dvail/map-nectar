import m from 'mithril'
import { tw } from '../util'

let RegionStyle = tw`transform-origin-tl bg-no-repeat`

let Region = {
  view: ({ attrs: { image, atlas, region, scale = 1.0 } }) => {
    let { x, y, w, h } = atlas[region]

    let style = {
      height: `${h}px`,
      width: `${w}px`,
      transform: `scale(${scale})`,
      backgroundImage: `url('${image}')`,
      backgroundPosition: `-${x}px -${y}px`,
    }

    return m(RegionStyle, { style })
  },
}

let RegionWrapper = {
  view: ({ attrs, attrs: { atlas, region, scale = 1.0 } }) => {
    let { w, h } = atlas[region]

    let style = {
      height: `${h * scale}px`,
      width: `${w * scale}px`,
    }

    return m('div', { style }, m(Region, attrs))
  },
}

export default {
  view: ({ attrs }) => m(RegionWrapper, attrs),
}
