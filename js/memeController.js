let gElCanvas
let gCtx

function onMemeInit() {
  gElCanvas = getEl('canvas')
  gCtx = gElCanvas.getContext('2d')
  addListeners()
  renderMeme()
  resizeCanvas()
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
    const textX = gElCanvas.width / 2
    const textY = gElCanvas.height / 5
    drawText(meme, selectedLine.txt, textX, textY)
    drawText(meme, meme.lines[1].txt, textX, textY + 100)
  }

  const gallery = getEl('.gallery')
  gallery.classList.add('hidden')

  const elEditor = getEl('.editor')
  elEditor.classList.remove('hidden')
}

function coverCanvasWithImg(elImg) {
  gElCanvas.height =
    (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
  const elContainer = getEl('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
}

function drawText(meme, text, x, y) {
  gCtx.lineWidth = 1
  gCtx.strokeStyle = 'white'
  gCtx.fillStyle = meme.lines[meme.selectedLineIdx].color
  gCtx.font = `${meme.lines[meme.selectedLineIdx].size}px Impact`
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  gCtx.strokeText(text, x, y)
  gCtx.fillText(text, x, y)
}

function onTextChange({ value }) {
  setLineTxt(value)
  renderMeme()
}

function downloadImg(elLink) {
  const imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}

function openColorPicker() {
  const colorInput = getEl('.color-picker')
  colorInput.click()
}

function onColorChange({ value }) {
  setTextColor(value)
  renderMeme()
}

function onFontSizeChange(diff) {
  setFontSize(diff)
  renderMeme()
}
