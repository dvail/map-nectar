
export function saveObject(obj, filename) {
  let a = document.createElement('a')
  let text = JSON.stringify(obj)
  a.setAttribute('href', `data:text/plain;charset=utf-u,${encodeURIComponent(text)}`)
  a.setAttribute('download', filename)
  a.click()
}
