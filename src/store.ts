import create, { GetState } from 'zustand'
import produce from 'immer'
import uuidv4 from 'uuid/v4'
import { ColorResult, RGBColor } from 'react-color'
import flow from 'lodash/fp/flow'
import keys from 'lodash/fp/keys'
import max from 'lodash/fp/max'
import map from 'lodash/fp/map'
import isEqual from 'lodash/fp/isEqual'
import some from 'lodash/fp/some'
import { fromNullable, fold } from 'fp-ts/es6/Option'

// TODO At some point this should be refactored to optionally point to a "favorite"
// in order to reduce storage size and allow for mass updates to "favorited" tiles
export interface TileOptions {
  fillColor: number
  fillAlpha: number
  strokeColor?: number
  strokeAlpha?: number
  // TODO Figure out how to enforce (tileSet & tileImage) are both null/non-null with the type system
  tileSet?: string
  tileImage?: string
}

export interface TileSprite {
  tileSet: string
  tileImage: string
}

// Tile Metadata can be a generic key value store of any associated scalar tile data
export interface TileMetadata {
  [key: string]: string | number | boolean
}

export interface TileFavorite {
  visual: {
    color: RGBColor
    tileSprite: TileSprite | null
  }
  meta: TileMetadata
}

export interface EditorData {
  // `favorites` are a list of re-useable tile config options, containing the visuals
  // to draw the tile as well as any user defined key-value metadata related to the tile
  favorites: TileFavorite[]
}

export interface AtlasRegion {
  x: number, y: number, w: number, h: number
}

export interface TileSet {
  meta: {
    imageFileName?: string,
    atlasFileName?: string,
  }
  image: string // A base64 encoding of a tileset image
  atlas: {
    [name: string]: AtlasRegion
  }
}

export interface TileSetMap {
  [id: string]: TileSet
}

export type TileMap = {
  [key: string]: TileCoords & TileData
}

export interface TileCoords {
  q: number
  r: number
}

// TODO These interfaces need to be defined more robustly (altitude should probably not be optional)
export interface TileData {
  altitude: number
  opts: TileOptions
}

export interface MapData {
  id: string
  name: string
  tiles: TileMap
  tileSets: TileSetMap
  editor: EditorData
}

export enum Widget {
  TileBuilder,
  SavedMapPane,
  TileSetPane,
  ColorPicker
}


function equalToFavorite(selectedTileColor: RGBColor, selectedTileSprite: TileSprite | null, favorite: TileFavorite): boolean {
  return isEqual(favorite.visual.color, selectedTileColor) &&
    isEqual(favorite.visual.tileSprite, selectedTileSprite)
}

export function selectedInFavorites(selectedTileColor: RGBColor, selectedTileSprite: TileSprite | null, favorites: TileFavorite[]) {
  return some<TileFavorite>(f => (
    isEqual(f.visual.color, selectedTileColor) &&
    isEqual(f.visual.tileSprite, selectedTileSprite)
  ))(favorites)
}

export interface Store {
  getAll: GetState<Store>
  shiftKey: boolean
  rotation: RotationInterval
  viewAngle: number
  mapData: MapData
  openWidget: Widget | null
  dockDrawerOpen: boolean

  selectedTileSprite: TileSprite | null
  selectedTileColor: RGBColor,

  setShiftKey(isPressed: boolean): void
  increaseAngle(): void
  decreaseAngle(): void
  rotateClock(): void
  rotateCounter(): void

  addMapTileSet(tileSet: TileSet): void

  addToFavorites(color: RGBColor, tileSprite?: TileSprite | null): void
  removeFromFavorites(color: RGBColor, tileSprite?: TileSprite | null): void
  toggleFavorite(color: RGBColor, tileSprite?: TileSprite | null): void

  removeTile(tile: TileCoords): void
  updateTile(tile: TileCoords & Partial<TileData>): void

  mapLoad(payload: MapData): void
  setRotation(rotation: number): void
  setSelectedTileColor(color: ColorResult): void
  setSelectedTileSprite(tileSprite: TileSprite | undefined): void
  toggleWidget(widgetType: Widget | null): void
  setMapName(name: string): void
}

// TODO Maybe move this stuff out of here?
export type RotationInterval = 0 | 30 | 60 | 90 | 120 | 150 | 180 | 210 | 240 | 270 | 300 | 330
export const RotationIncrement = 360 / 12
export const AngleIncrement = 0.05
export const tileKey = (q: number, r: number) => [q, r].toString()

const startingViewAngle = 0.65

export const [useStore] = create<Store>((set, get) => ({
  getAll: get,
  rotation: 0,
  shiftKey: false,
  viewAngle: startingViewAngle,
  mapData: {
    id: uuidv4(),
    name: 'New Map',
    tiles: {},
    tileSets: {},
    editor: {
      favorites: [],
    },
  },

  openWidget: null,
  dockDrawerOpen: false,

  selectedTileSprite: null,
  selectedTileColor: { r: 187, g: 128, b: 68 },

  setShiftKey: (isPressed: boolean) => {
    set({ shiftKey: isPressed })
  },
  rotateClock: () => {
    let { rotation } = get()
    rotation += RotationIncrement
    rotation %= 360
    set({ rotation: rotation as RotationInterval })
  },
  rotateCounter: () => {
    let { rotation } = get()
    rotation -= RotationIncrement
    rotation += 360 // Don't rotate below 0 degrees
    rotation %= 360
    set({ rotation: rotation as RotationInterval })
  },
  increaseAngle: () => {
    set({ viewAngle: Math.min(get().viewAngle + 0.05, 1.0) })
  },
  decreaseAngle: () => {
    set({ viewAngle: Math.max(get().viewAngle - 0.05, 0.0) })
  },
  toggleWidget: (widget: Widget) => {
    if (get().openWidget === widget) {
      set({ openWidget: null })
    } else {
      set({ openWidget: widget })
    }
  },
  mapLoad: (payload: MapData) => {
    let mapData = produce(get().mapData, (next: MapData) => {
      next.tileSets = payload.tileSets ?? {}
      next.tiles = payload.tiles
      next.name = payload.name ?? next.name
      next.id = payload.id ?? next.id
      next.editor = payload.editor ?? { favorites: [] }
    })

    set({ mapData })
  },

  addMapTileSet: (tileSet: TileSet) => {
    let mapData = produce(get().mapData, (next: MapData) => {
      let nextId = flow(
        keys,
        map(Number),
        max,
        fromNullable,
        fold(
          () => 1,
          (n) => n + 1,
        ),
      )(next.tileSets)

      next.tileSets[nextId] = tileSet
    })

    set({ mapData })
  },
 addToFavorites: (color: RGBColor, tileSprite: TileSprite | null) => {
    let oldMapData = get().mapData
    let mapData = produce(oldMapData, (next: MapData) => {
      next.editor.favorites = [
        ...next.editor.favorites,
        {
          visual: { color, tileSprite: tileSprite ?? null },
          meta: {},
        },
      ]
    })

    set({ mapData })
  },
  removeFromFavorites: (color: RGBColor, tileSprite: TileSprite | null) => {
    let mapData = produce(get().mapData, (next: MapData) => {
      next.editor.favorites = next.editor.favorites.filter(f => !equalToFavorite(color, tileSprite, f))
    })

    set({ mapData })
  },

  toggleFavorite: (color: RGBColor, tileSprite: TileSprite | null) => {
    let oldMapData = get().mapData
    if (selectedInFavorites(color, tileSprite, oldMapData.editor.favorites)) {
      get().removeFromFavorites(color, tileSprite)
    } else {
      get().addToFavorites(color, tileSprite)
    }
  },

  setSelectedTileSprite: (tileSprite: TileSprite) => {
    set({ selectedTileSprite: tileSprite })
  },
  setSelectedTileColor: (color: ColorResult) => {
    set({ selectedTileColor: color.rgb })
  },

  setRotation: (rotation: number) => {
    set({ rotation: rotation as RotationInterval })
  },

  setMapId: (id: string) => {
    let mapData = produce(get().mapData, (next: MapData) => {
      next.id = id
    })

    set({ mapData })
  },
  setMapName: (name: string) => {
    let mapData = produce(get().mapData, (next: MapData) => {
      next.name = name
    })

    set({ mapData })
  },
  removeTile: (tile: TileCoords) => {
    let mapData = produce(get().mapData, (next: MapData) => {
      let key = tileKey(tile.q, tile.r)
      delete next.tiles[key]
    })

    set({ mapData })
  },
  updateTile: (tile: TileCoords & Partial<TileData>) => {
    let prev = get().mapData
    let mapData = produce(prev, (next: MapData) => {
      let key = tileKey(tile.q, tile.r)
      next.tiles[key] = {
        ...prev.tiles[key],
        ...tile,
      }
    })

    set({ mapData })
  },
}))
