'use strict'

function renderSavedMemes() {
  const savedMemes = getSavedMemes()
  console.log(savedMemes)
  let galleryHTML = ''

  savedMemes.forEach((meme, index) => {
    galleryHTML += `<img src="${meme.imgURL}"
    onclick="savedImgSelect(${index})">`
  })

  setElHtml('.saved-memes-body', galleryHTML)
}

function savedImgSelect(memeIndex) {
  const savedMemes = getSavedMemes()
  const selectedMeme = savedMemes[memeIndex]

  setSavedImg(selectedMeme.imgURL, selectedMeme)
  moveToEditor()
  onMemeInit()
}
