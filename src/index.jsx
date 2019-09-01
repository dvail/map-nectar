import m from 'mithril'
import stream from 'mithril/stream'

import RenderPane from './renderPane'
import Sidebar from './sidebar'
import Compass from './compass'
import { tileKey } from './mapDataReducer'
import { MapViewAction, RotationIncrement }  from './mapViewReducer'

import './index.css'

const { RotateClock } = MapViewAction

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

let actions = {
  SetShift: e => {
    update(state => ({ ...state, shiftKey: e.shiftKey }))
  },
  SetRotation: (newRotation) => {
    let fn = state => ({ ...state, rotation: newRotation })
    update(fn)
  },
  Rotate: direction => {
    let fn = state => {
      let { rotation } = state
      if (direction === RotateClock) {
        rotation += RotationIncrement
      } else {
        rotation -= RotationIncrement
        rotation += 360 // Don't rotate below 0 degrees
      }

      rotation %= 360
      return { ...state, rotation }
    }
    update(fn)
  },
  MapLoad: tiles => {
    let fn = state => {
      const mapData = { ...state.mapData, ...tiles }
      return { ...state, mapData }
    }
    update(fn)
  },
  RemoveTile: data => {
    let fn = state => {
      let key = tileKey(data.q, data.r)
      let newMapData = { ...state.mapData }

      delete newMapData.tiles[key]

      return { ...state, mapData: newMapData }
    }

    update(fn)
  },
  UpdateTile: data => {
    let fn = state => {
      let key = tileKey(data.q, data.r)
      let newTile = { ...state.mapData.tiles[key], ...data }
      let newTiles = { ...state.mapData.tiles, [key]: newTile }
      let newMapData = { ...state.mapData, tiles: newTiles }

      console.warn(newMapData)

      return { ...state, mapData: newMapData }
    }
    update(fn)
  },
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
