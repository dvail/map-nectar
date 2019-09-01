import m from 'mithril'
import stream from 'mithril/stream'
import produce from 'immer'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import { tileKey } from './mapDataReducer'
import { RotationIncrement }  from './mapViewReducer'

import './index.css'

const defaultMapData = { tiles: {} }

const mRoot = document.querySelector('.m-app')

let update = stream()
let stateUpdate = (appState, fn) => fn(appState)

let InitialState = {
  rotation: 0,
  viewAngle: 0.65,
  mapData: defaultMapData,
  shiftKey: false,
}

let states = stream.scan(stateUpdate, InitialState, update)

// Uses Immer to imperitively create a next state and update the main stream
function produceUpdate(producer) {
  return payload => {
    update(prev => produce(prev, next => producer(prev, next, payload)))
  }
}

let actions = {
  SetShift: produceUpdate((prev, next, e) => {
    next.shiftKey = e.shiftKey
  }),
  SetRotation: produceUpdate((prev, next, rotation) => {
    next.rotation = rotation
  }),
  RotateClock: produceUpdate((prev, next) => {
    next.rotation += RotationIncrement
    next.rotation %= 360
  }),
  RotateCounter: produceUpdate((prev, next) => {
    next.rotation -= RotationIncrement
    next.rotation += 360 // Don't rotate below 0 degrees
    next.rotation %= 360
  }),
  MapLoad: produceUpdate((prev, next, payload) => {
    next.mapData.tiles = payload.tiles
  }),
  RemoveTile: produceUpdate((prev, next, payload) => {
    let key = tileKey(payload.q, payload.r)
    delete next.mapData.tiles[key]
  }),
  UpdateTile: produceUpdate((prev, next, payload) => {
    let key = tileKey(payload.q, payload.r)

    next.mapData.tiles[key] = {
      ...prev.mapData.tiles[key],
      ...payload,
    }
  }),
}

const rootComp = () => ({
  view: () => m(
    '.app-layout',
    {
      style: { backgroundColor: 'transparent' },
      onkeydown: e => actions.setShift(e),
      onkeyup: e => actions.setShift(e),
    },
    m(Sidebar, { state: states(), actions }),
    m(
      '.workspace',
      m(RenderPane, { state: states(), actions }),
    ),
    m(Compass, { state: states(), actions }),
  ),
})

m.mount(mRoot, rootComp);
