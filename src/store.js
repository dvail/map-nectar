import create from 'zustand'
import produce from 'immer'

// TODO Maybe move this stuff out of here?
export const RotationIncrement = 360 / 12
export const AngleIncrement = 0.05
export const tileKey = (q, r) => [q, r].toString()

export const [useStore] = create((set, get) => ({
  getAll: get,
  rotation: 0,
  viewAngle: 0.65,
  mapData: { tiles: {} },
  tileBuilderOpen: false,
  dockDrawerOpen: false,
  selectedTileImage: null,
  rotateClock: () => {
    let { rotation } = get()
    rotation += RotationIncrement
    rotation %= 360
    set({ rotation })
  },
  rotateCounter: () => {
    let { rotation } = get()
    rotation -= RotationIncrement
    rotation += 360 // Don't rotate below 0 degrees
    rotation %= 360
    set({ rotation })
  },
  increaseAngle: () => {
    set({ viewAngle: Math.min(get().viewAngle + 0.05, 1.0) })
  },
  decreaseAngle: () => {
    set({ viewAngle: Math.max(get().viewAngle - 0.05, 0.0) })
  },
  toggleTileBuilder: () => {
    set({ tileBuilderOpen: !get().tileBuilderOpen })
  },
  setTileBuilderOpen: isOpen => {
    set({ tileBuilderOpen: isOpen })
  },
  mapLoad: payload => {
    let mapData = produce(get().mapData, next => {
      next.tiles = payload.tiles
    })

    set({ mapData })
  },
  setSelectedTileImage: imageName => {
    set({ selectedTileImage: imageName })
  },
  setRotation: rotation => {
    set({ rotation })
  },
  removeTile: payload => {
    let mapData = produce(get().mapData, next => {
      let key = tileKey(payload.q, payload.r)
      delete next.tiles[key]
    })

    set({ mapData })
  },
  updateTile: payload => {
    let prev = get().mapData
    let mapData = produce(prev, next => {
      let key = tileKey(payload.q, payload.r)
      next.tiles[key] = {
        ...prev.tiles[key],
        ...payload,
      }
    })

    set({ mapData })
  },
}))
