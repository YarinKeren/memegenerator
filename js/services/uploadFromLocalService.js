'use strict'

function onImgInput(ev) {
  loadImageFromInput(ev, drawImg)
}

function loadImageFromInput(ev) {
  const reader = new FileReader()

  reader.onload = function (event) {
    let img = new Image()
    img.src = event.target.result

    img.onload = () => {
      gImgs.push({
        id: makeId(),
        url: img.src,
        keywords: ['random'],
      })
      renderGallery()
    }
  }
  reader.readAsDataURL(ev.target.files[0])
}

function drawImg(img) {
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}
