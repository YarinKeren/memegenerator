function getEl(selector) {
  return document.querySelector(selector)
}

function makeId(length = 6) {
  var id = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    id += possible.charAt(getRandomInt(0, possible.length))
  }
  return id
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function saveToStorage(key, value) {
  const str = JSON.stringify(value)
  localStorage.setItem(key, str)
}

function loadFromStorage(key) {
  const str = localStorage.getItem(key)
  return JSON.parse(str)
}