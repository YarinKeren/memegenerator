function renderSavedMemes() {
  const elGallery = getEl('.saved-memes-body')
  const savedMemes = getSavedMemes()

  let galleryHTML = ''

  savedMemes.forEach((meme, index) => {
    galleryHTML += `<img src="${meme.imgURL}" alt="" onclick="savedImgSelect(this, ${index})">`
  })

  //   for (let i = 0; i < savedMemes.length; i++) {
  //     galleryHTML += `<img src="meme-imgs/meme-imgs/${
  //       i + 1
  //     }.jpg" alt="" onclick="onImgSelect(this)">`
  //   }

  elGallery.innerHTML = galleryHTML
}

function savedImgSelect(elImg, memeIndex) {
  const savedMemes = getSavedMemes()
  const selectedMeme = savedMemes[memeIndex]
  const startIndex = elImg.src.indexOf('meme-imgs')
  const imagePath = elImg.src.substring(startIndex)

  setSavedImg(imagePath, selectedMeme)
  onMemeInit()
}
