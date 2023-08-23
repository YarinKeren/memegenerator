let gElCanvas
let gCtx

function onMemeInit() {
  gElCanvas = getEl('canvas')
  gCtx = gElCanvas.getContext('2d')
  toggleView()
  addListeners()
  renderMeme()
  resizeCanvas()
}

function toggleView() {
  const gallery = getEl('.gallery')
  gallery.classList.add('hidden')
  const elEditor = getEl('.editor')
  elEditor.classList.remove('hidden')
}

function addListeners() {
  window.addEventListener('resize', () => {
    resizeCanvas()
    renderMeme()
  })
  gElCanvas.addEventListener('click', (event) => {
    onLineClick(event)
  })
}

function onLineClick({ offsetX, offsetY }) {
  const meme = getMeme()

  meme.lines.forEach((line, i) => {
    const textWidth = gCtx.measureText(line.txt).width
    const textHeight = line.size

    if (
      offsetX >= line.x - textWidth / 2 &&
      offsetX <= line.x + textWidth / 2 &&
      offsetY >= line.y - textHeight / 2 &&
      offsetY <= line.y + textHeight / 2
    ) {
      meme.selectedLineIdx = i
      renderMeme()
    }
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
      line.x = gElCanvas.width / 2
      line.y = (gElCanvas.height / (meme.lines.length + 1)) * (i + 1)
      const isSelected = i === meme.selectedLineIdx

      drawText(line, isSelected)
    })
  }

  const elTextInput = getEl('.text-input')
  elTextInput.value = meme.lines[meme.selectedLineIdx].txt
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

function drawText(line, isSelected) {
  gCtx.lineWidth = 3
  gCtx.strokeStyle = 'black'
  gCtx.textAlign = 'center'
  gCtx.textBaseline = 'middle'

  let textWidth = gCtx.measureText(line.txt).width
  if (gMeme.selectedLineIdx === 0) textWidth *= 2.7

  if (isSelected) {
    gCtx.fillStyle = 'rgba(181, 181, 181, 0.7)'
    gCtx.fillRect(
      line.x - textWidth / 2 - 5,
      line.y - line.size / 2,
      textWidth + 10,
      line.size
    )
    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
  } else {
    gCtx.font = `${line.size}px Impact`
    gCtx.fillStyle = line.color
  }

  gCtx.strokeText(line.txt, line.x, line.y)
  gCtx.fillText(line.txt, line.x, line.y)
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
