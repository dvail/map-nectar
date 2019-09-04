import m from 'mithril'

let Region = {
  view: ({ attrs: { image, atlas, region, scale = 1.0 } }) => {
    let { x, y, w, h } = atlas[region]

    let regionStyle = {
      height: `${h}px`,
      width: `${w}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url('${image}')`,
      backgroundPosition: `-${x}px -${y}px`,
    }

    return m('div', { style: regionStyle })
  },
}

let RegionWrapper = {
  view: ({ attrs, attrs: { atlas, region, scale = 1.0 } }) => {
    let { w, h } = atlas[region]

    let wrapperStyle = {
      height: `${h * scale}px`,
      width: `${w * scale}px`,
    }

    return m('div', { style: wrapperStyle }, m(Region, attrs))
  },
}

export default {
  view: ({ attrs }) => m(RegionWrapper, attrs),
}
