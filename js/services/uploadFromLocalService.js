'use strict'

function onImgInput(ev) {
  loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev) {
  const reader = new FileReader()

  reader.onload = function (event) {
    let img = new Image()
    img.src = event.target.result

    img.onload = () => {
      gImgs.push({
        id: '19',
        url: img.src,
        keywords: ['random'],
      })
      renderGallery()
    }
  }
  reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}
