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

    meme.lines.forEach((line, i) => {
      const textX = gElCanvas.width / 2
      const textY = (gElCanvas.height / (meme.lines.length + 1)) * (i + 1)

      const isSelected = i === meme.selectedLineIdx

      drawText(line, line.txt, textX, textY, isSelected)
    })
  }

  const elTextInput = getEl('.text-input')
  elTextInput.value = meme.lines[meme.selectedLineIdx].txt

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

function drawText(line, text, x, y, isSelected) {
  gCtx.lineWidth = 1
  gCtx.strokeStyle = 'white'
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  const textWidth = gCtx.measureText(text).width

  if (isSelected) {
    gCtx.fillStyle = 'rgba(181, 181, 181, 0.7)'
    gCtx.fillRect(
      x - textWidth / 2 - 5,
      y - line.size / 2,
      textWidth + 10,
      line.size
    )
    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
  } else {
    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
  }

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

function onAddLine() {
  addLine()
  renderMeme()
  const elTextInput = getEl('.text-input')
  elTextInput.focus()
  elTextInput.value = ''
}

function onSwitchLine() {
  switchLineIdx()
  renderMeme()
}
