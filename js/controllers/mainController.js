'use strict'

function onInit() {
  renderGallery()
  addNavListener()
  renderKeywordsSearch()
}

function addNavListener() {
  let header = getEl('.navbar')
  let btns = getEls('.nav-item', header)
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let selected = getEls('.active')
      if (selected.length) selected[0].classList.remove('active')
      btn.classList.add('active')
    })
  })
}

function moveToGallery() {
  getEl('.gallery').classList.remove('hidden')
  getEl('.editor').classList.add('hidden')
  getEl('.saved-memes').classList.add('hidden')
}

function moveToSaved() {
  getEl('.gallery').classList.add('hidden')
  getEl('.editor').classList.add('hidden')
  getEl('.saved-memes').classList.remove('hidden')
  renderSavedMemes()
}
