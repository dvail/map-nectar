import m from 'mithril'
import htm from 'htm'

// Tagged template literals converted to hyperscript
export const html = htm.bind(m)

export function saveObject(obj, filename) {
  let a = document.createElement('a')
  let text = JSON.stringify(obj)
  a.setAttribute('href', `data:text/plain;charset=utf-u,${encodeURIComponent(text)}`)
  a.setAttribute('download', filename)
  a.click()
}

export function tw(strings) {
  console.warn('DEPRECATE ME')
  return strings.raw[0].split(/\s+/).filter(s => s).map(s => `.${s}`).join('')
}
