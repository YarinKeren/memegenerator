function onInit() {
  renderGallery()
}

function renderGallery() {
  const elGallery = getEl('.gallery')
  elGallery.innerHTML = `
  <img src="meme-imgs/meme-imgs/1.jpg" alt="" onclick="onImgSelect(this)">
  <img src="meme-imgs/meme-imgs/2.jpg" alt="" onclick="onImgSelect(this)">
  `
}

function onImgSelect(elImg) {
  const startIndex = elImg.src.indexOf('meme-imgs')
  const imagePath = elImg.src.substring(startIndex)
  setImg(imagePath)
  onMemeInit()
}
