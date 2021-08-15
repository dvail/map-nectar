import { MapData } from '../store'

const CURRENT_MAP = "CURRENT_MAP"
const MAP_STORAGE_KEY = "MAP_STORAGE"

interface StoredMapObject {
  [mapName: string]: MapData;
}

export function saveAsFile(mapData: MapData, filename: string) {
  let a = document.createElement('a')
  let text = JSON.stringify(mapData)
  a.setAttribute('href', `data:text/plain;charset=utf-u,${encodeURIComponent(text)}`)
  a.setAttribute('download', filename)
  a.click()
}

export function getCurrentMap() {
  return localStorage.getItem(CURRENT_MAP)
}

export function loadLocal(id: string) {
  let json = localStorage.getItem(MAP_STORAGE_KEY) ?? '{}';
  let maps = JSON.parse(json) ?? {}
  localStorage.setItem(CURRENT_MAP, id)

  return maps[id]
}

export function saveLocal(mapData: MapData) {
  let json = localStorage.getItem(MAP_STORAGE_KEY) ?? '{}';
  let maps = JSON.parse(json) ?? {}

  maps[mapData.id] = mapData

  localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(maps))
  localStorage.setItem(CURRENT_MAP, mapData.id)
}

export function getSavedMaps(): StoredMapObject {
  let json = localStorage.getItem(MAP_STORAGE_KEY) ?? '{}';
  let maps = JSON.parse(json) ?? {}

  return maps ?? {}
}

export function deleteMap(id: string) {
  let json = localStorage.getItem(MAP_STORAGE_KEY) ?? '{}';
  let maps = JSON.parse(json) ?? {}

  delete maps[id]

  localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(maps));
}
