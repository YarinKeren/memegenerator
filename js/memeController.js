let gElCanvas
let gCtx

function onMemeInit() {
  gElCanvas = getEl('canvas')
  gCtx = gElCanvas.getContext('2d')
  addListeners()
  resizeCanvas()
  renderMeme()
}

function addListeners() {
  window.addEventListener('resize', () => {
    resizeCanvas()
    renderMeme()
  })
}

function renderMeme() {
  const meme = getMeme()
  const elImg = new Image()
  const imgUrl = getImgUrlByIdx(meme.selectedImgIdx)
  elImg.src = imgUrl
  elImg.onload = () => {
    coverCanvasWithImg(elImg)
    const selectedLine = meme.lines[meme.selectedLineIdx]
    const textX = gElCanvas.width / 2 // Adjust as needed
    const textY = gElCanvas.height / 5 // Adjust as needed
    drawText(selectedLine.txt, textX, textY)
  }

  const gallery = getEl('.gallery')
  gallery.classList.add('hidden')

  const elEditor = getEl('.editor')
  elEditor.classList.remove('hidden')
  gElCanvas.height = 500
  gElCanvas.width = 500
}

function coverCanvasWithImg(elImg) {
  gElCanvas = getEl('canvas')

  gElCanvas.height =
    (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
  const elContainer = getEl('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function drawText(text, x, y) {
  // Adjust the scaling factor as needed
  const fontSize = gElCanvas.width * 0.04

  gCtx.lineWidth = 2
  gCtx.strokeStyle = 'brown'
  gCtx.fillStyle = 'black'
  gCtx.font = `${fontSize}px Arial` // Use the calculated font size
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  gCtx.fillText(text, x, y)
  gCtx.strokeText(text, x, y)
}

function onTextChange({ value }) {
  setLineTxt(value)
  renderMeme()
}
