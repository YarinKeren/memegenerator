'use strict'

function renderSavedMemes() {
  const savedMemes = getSavedMemes()
  let galleryHTML = ''

  if (!savedMemes) return

  savedMemes.forEach((meme, index) => {
    galleryHTML += `<img src="${meme.fullData}"
    onclick="savedImgSelect(${index})">`
  })

  setElHtml('.saved-memes-body', galleryHTML)
}

function savedImgSelect(memeIndex) {
  const savedMemes = getSavedMemes()
  const selectedMeme = savedMemes[memeIndex]

  setSavedImg(selectedMeme)
  moveToEditor()
  onMemeInit()
}
