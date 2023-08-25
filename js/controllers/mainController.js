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
  removeClass('hidden', '.gallery')
  addClass('hidden', '.editor')
  addClass('hidden', '.saved-memes')
}

function moveToEditor() {
  addClass('hidden', '.gallery')
  addClass('hidden', '.saved-memes')
  removeClass('hidden', '.editor')
  removeClass('active', '.gallery-link')
}

function moveToSaved() {
  addClass('hidden', '.gallery')
  addClass('hidden', '.editor')
  removeClass('hidden', '.saved-memes')
  renderSavedMemes()
}

function onToggleLanguage(elBtn) {
  const lang = elBtn.innerHTML.trim()
  const isr = '<img src="styles/img/israel.png">'
  const usa = '<img src="styles/img/usa.png">'
  if (lang === isr) {
    onSetLang('he')
    elBtn.innerHTML = usa
  } else {
    onSetLang('en')
    elBtn.innerHTML = isr
  }
}

function onSetLang(lang) {
  setLang(lang)
  changeBodyDirection(lang)
  doTrans()
}

function changeBodyDirection(lang) {
  if (lang === 'he') addClass('rtl', 'body')
  else removeClass('rtl', 'body')
}
