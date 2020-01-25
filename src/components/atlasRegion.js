export default {
  view: ({ attrs: { image, atlas, region, scale = 1.0 } }) => {
    let { x, y, w, h } = atlas[region]

    let wrapperStyle = `
      height: ${h * scale}px;
      width: ${w * scale}px;
    `

    let style = `
      height: ${h}px;
      width: ${w}px;
      transform: scale(${scale});
      background-image: url('${image}');
      background-position: -${x}px -${y}px;
    `

    return (
      <div style={wrapperStyle}>
        <div style={style} class='transform-origin-tl bg-no-repeat' />
      </div>
    )
  },
}
