function onInit() {
  renderGallery()
  addNavListener()
}

function addNavListener() {
  var header = getEl('.navbar')
  var btns = header.querySelectorAll('.nav-item')
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      let selected = document.querySelectorAll('.active')
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
