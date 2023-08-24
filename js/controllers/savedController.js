'use strict'

function renderSavedMemes() {
  const savedMemes = getSavedMemes()
  let galleryHTML = ''

  savedMemes.forEach((meme, index) => {
    galleryHTML += `<img src="${meme.imgURL}"
    onclick="savedImgSelect(${index})">`
  })

  const elGallery = getEl('.saved-memes-body')
  elGallery.innerHTML = galleryHTML
}

function savedImgSelect(memeIndex) {
  const savedMemes = getSavedMemes()
  const selectedMeme = savedMemes[memeIndex]

  setSavedImg(selectedMeme.imgURL, selectedMeme)
  onMemeInit()
}
