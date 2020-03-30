const MAP_STORAGE_KEY = "MAP_STORAGE"

export function saveAsFile(obj, filename) {
  let a = document.createElement('a')
  let text = JSON.stringify(obj)
  a.setAttribute('href', `data:text/plain;charset=utf-u,${encodeURIComponent(text)}`)
  a.setAttribute('download', filename)
  a.click()
}

export function loadLocal(id) {
  let json = localStorage.getItem(MAP_STORAGE_KEY);
  let maps = JSON.parse(json)

  return maps[id]
}

export function saveLocal(mapData) {
  let json = localStorage.getItem(MAP_STORAGE_KEY);
  let maps = JSON.parse(json) ?? {}

  maps[mapData.id] = mapData

  localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(maps));
}

export function getSavedMaps() {
  let json = localStorage.getItem(MAP_STORAGE_KEY);
  let maps = JSON.parse(json)

  return maps ?? {}
}
