function onInit() {
  renderGallery()
}

function renderGallery() {
  const elGallery = getEl('.gallery-body')
  let galleryHTML = ''

  for (let i = 0; i < 18; i++) {
    galleryHTML += `<img src="meme-imgs/meme-imgs/${
      i + 1
    }.jpg" alt="" onclick="onImgSelect(this)">`
  }

  elGallery.innerHTML += galleryHTML
}

function onImgSelect(elImg) {
  const startIndex = elImg.src.indexOf('meme-imgs')
  const imagePath = elImg.src.substring(startIndex)
  setImg(imagePath)
  onMemeInit()
}

function onFlexible() {
  setImg(`meme-imgs/meme-imgs/${getRandomInt(1, 19)}.jpg`)
  onMemeInit()
}
