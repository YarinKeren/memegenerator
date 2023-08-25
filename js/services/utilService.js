'use strict'

function getEl(selector) {
  return document.querySelector(selector)
}

function getEls(selector, el = document) {
  return el.querySelectorAll(selector)
}

function removeClass(className, selector) {
  document.querySelector(selector).classList.remove(className)
}

function addClass(className, selector) {
  document.querySelector(selector).classList.add(className)
}

function setElHtml(selector, html) {
  const el = document.querySelector(selector)
  el.innerHTML = html
}

function makeId(length = 6) {
  let id = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
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
