import m from 'mithril'
import stream from 'mithril/stream'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import _ from 'lodash'

import ColorUtils from '../colorUtils'
import HexagonGrid from '../hexagonGrid'
import { tileKey } from '../appState'

const skeletonTileOpts = { strokeColor: 0xbbbbbb, fillColor: 0x111111, strokeAlpha: 0.1, fillAlpha: 0.1 }
const gridLayoutOps = { gridX: 0, gridY: 0, tileSize: 35, viewAngle: 0.65 }

function RenderPane(initialVnode) {
  let { actions } = initialVnode.attrs
  let initialState = initialVnode.attrs.state
  let app
  let viewport
  let skeletonGrid
  let hexGrid

  let shiftDragCoords = stream(null)
  let dragging = stream(false)
  let shiftKey = stream(initialState.shiftKey)
  let mapData = stream(initialState.mapData)

  function onTileClick(ev, q, r) {
  }

  function onTileRightClick(ev, q, r) {
    if (dragging()) return

    let shift = ev.data.originalEvent.shiftKey
    let tile = mapData().tiles[tileKey(q, r)]

    if (shift && !tile) return

    let height = tile ?.height + (shift ? -1 : 1) || 0
    let opts = tile ?.opts || {
      fillColor: ColorUtils.shift(0xFF9933, 0, -q * 20, r * 20),
    }

    if (height < 0) {
      actions.RemoveTile({ q, r })
    } else {
      actions.UpdateTile({ q, r, height, opts })
    }

    m.redraw();
  }

  function onDragStart(e) {
    let { x, y } = e.data.global

    if (!shiftDragCoords()) {
      shiftDragCoords({ x, y })
    }
  }

  function onDragMove(e) {
    if (!shiftKey()) return
    console.warn('Can I detect event.buttons in here to avoid the dragStart/End methods?')

    let { x, y } = e.data.global

    if (!shiftDragCoords()) {
      shiftDragCoords({ x, y })
    }

    let { x: ox, y: oy } = shiftDragCoords()
    let deltaX = x - ox
    let deltaY = y - oy

    // TODO Configure these magic numbers?
    let xRotations = Math.round(deltaX / 40)
    let yRotations = Math.round(deltaY / 40)

    if (xRotations || yRotations) {
      shiftDragCoords({ x, y })
    }

    if (xRotations < 0) {
      actions.RotateClock()
    } else if (xRotations > 0) {
      actions.RotateCounter()
    }

    if (yRotations < 0) {
      actions.IncreaseAngle()
    } else if (yRotations > 0) {
      actions.DecreaseAngle()
    }

    if (xRotations !== 0 || yRotations !== 0) {
      m.redraw()
    }
  }

  function onDragEnd() {
    shiftDragCoords(null)
  }

  function oncreate(vnode) {
    let paneElem = vnode.dom
    app = new PIXI.Application({ resizeTo: paneElem })
    paneElem.appendChild(app.view)

    viewport = new Viewport({ interaction: app.renderer.plugins.interaction })

    app.stage.addChild(viewport)

    viewport.drag().wheel()
    viewport.on('drag-start', () => dragging(true))
    viewport.on('drag-end', () => dragging(false))
    viewport.moveCenter(275, 50) // TODO These are magic values...

    skeletonGrid = HexagonGrid.create({ ...gridLayoutOps, onTileClick, onTileRightClick })

    hexGrid = HexagonGrid.create({ ...gridLayoutOps, onTileClick, onTileRightClick })
    // TODO The performance of this probably sucks
    _.range(-10, 10).forEach(q => {
      _.range(-10, 10).forEach(r => {
        skeletonGrid.renderTile({ q, r, height: 0, opts: skeletonTileOpts })
      })
    })

    viewport.addChild(skeletonGrid.container)

    viewport.on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove)

    viewport.addChild(hexGrid.container)
  }

  function onbeforeupdate(vnode, old) {
    let newState = vnode.attrs.state
    let oldState = old.attrs.state

    mapData(newState.mapData)
    shiftKey(newState.shiftKey)

    // TODO Convert this section to make better use of streams?
    if (newState.rotation !== oldState.rotation) {
      hexGrid?.setRotation(newState.rotation)
      skeletonGrid?.setRotation(newState.rotation)
    }

    if (newState.viewAngle !== oldState.viewAngle) {
      hexGrid?.setAngle(newState.viewAngle)
      skeletonGrid?.setAngle(newState.viewAngle)
    }

    if (newState.shiftKey) {
      viewport?.plugins.pause('drag')
    } else {
      viewport?.plugins.resume('drag')
    }

    // Note: This relies on an object reference change, since data updates
    // are immutable, the object reference changing indicates a new set of map
    // tiles.
    if (newState.mapData.tiles !== oldState.mapData.tiles) {
      hexGrid?.renderTiles(newState.mapData.tiles)
    }
  }

  return {
    oncreate,
    onbeforeupdate,
    view: () => m(
      '.w-full.h-full',
      { oncontextmenu: () => false },
    ),
  }
}

export default RenderPane
