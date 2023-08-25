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

function onToggleLanguage(elBtn) {
  const lang = elBtn.innerText
  if (lang === 'Heb') {
    onSetLang('he')
    elBtn.innerText = 'Eng'
  } else {
    onSetLang('en')
    elBtn.innerText = 'Heb'
  }
}

function onSetLang(lang) {
  setLang(lang)
  changeBodyDirection(lang)
  doTrans()
  // renderBooks()
  // renderCards()
}

function changeBodyDirection(lang) {
  if (lang === 'he') document.body.classList.add('rtl')
  else document.body.classList.remove('rtl')
}
