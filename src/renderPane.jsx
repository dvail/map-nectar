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

    let hexagon = Hexagon.create({ x: 200, y: 200 });

    app.stage.addChild(hexagon);
  }, []);

  return <StyledPane ref={paneElem} />
}
