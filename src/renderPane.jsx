import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import * as PIXI from 'pixi.js'

import Hexagon from './hexagon'

const StyledPane = styled.div`
  border: 1px solid black;
  min-width: 500px;
  min-height: 500px;
`

export default function RenderPane() {
  let paneElem = useRef(null);

  useEffect(() => {
    let app = new PIXI.Application();

    paneElem.current.appendChild(app.view);

    const tileSize = 50
    // pointy
    app.stage.addChild(Hexagon.create({ x: 200 - (tileSize / 2 * Math.sqrt(3)), y: 200 - (tileSize * 4 / 3), orientation: Hexagon.ORIENTATION.POINTY }))
    app.stage.addChild(Hexagon.create({ x: 200, y: 200, orientation: Hexagon.ORIENTATION.POINTY }))
    app.stage.addChild(Hexagon.create({ x: 200 - (tileSize * Math.sqrt(3)), y: 200, orientation: Hexagon.ORIENTATION.POINTY }))

    // flat
    app.stage.addChild(Hexagon.create({ x: 400, y: 400, orientation: Hexagon.ORIENTATION.FLAT }))
    app.stage.addChild(Hexagon.create({ x: 300, y: 350, orientation: Hexagon.ORIENTATION.FLAT }))
  }, []);

  return <StyledPane ref={paneElem} />
}
